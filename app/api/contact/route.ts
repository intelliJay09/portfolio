import { NextRequest, NextResponse } from 'next/server'
import { queueEmailProcessing, generateSubmissionId, type ContactFormData } from '../../../lib/email-queue'

// reCAPTCHA v3 verification function
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = '6LdXkIUUAAAAAIbVb0Av-7S2y4VZJdMf2oKJ8p5i'

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()

    // reCAPTCHA v3 returns a score (0.0 - 1.0)
    // 0.5 is a reasonable threshold; adjust based on your needs
    const isValid = data.success && data.score >= 0.5

    if (!isValid) {
      console.log('reCAPTCHA verification failed:', {
        success: data.success,
        score: data.score,
        action: data.action,
        errors: data['error-codes']
      })
    }

    return isValid
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Helper function to get client IP
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '5')
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '3600000')
  
  const record = rateLimitStore.get(ip)
  
  if (!record || record.resetTime < now) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// Enhanced email validation regex (more strict)
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Enhanced security: prevent common spam patterns
const spamPatterns = [
  /viagra|cialis|pharmacy/i,
  /casino|gambling|poker/i,
  /bitcoin|crypto|investment/i,
  /urgent.*?help|emergency.*?fund/i,
  /prince|inheritance|million.*?dollar/i,
  /lottery|winner|congratulations.*?won/i,
  /\b(click|visit).*?https?:\/\//i,
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
]

// Rate limiting with progressive penalties
const progressiveRateLimitStore = new Map<string, { count: number; resetTime: number; penaltyLevel: number }>()

function checkSpamContent(text: string): boolean {
  return spamPatterns.some(pattern => pattern.test(text))
}

// Enhanced sanitization for potentially dangerous input
function sanitizeInput(text: string): string {
  return text
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Limit excessive line breaks
    .slice(0, 10000) // Hard limit
}

// Sanitize input to prevent XSS
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Store for request context (used by logging functions)
let request: NextRequest

// Comprehensive logging system
interface LogEntry {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  ip?: string
  metadata?: Record<string, unknown>
}

function logEvent(level: LogEntry['level'], message: string, metadata?: Record<string, unknown>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ip: request ? getClientIp(request) : undefined,
    metadata
  }

  const logMessage = `[${entry.timestamp}] ${entry.level}: ${entry.message}`
  
  if (entry.ip) {
    console.log(`${logMessage} | IP: ${entry.ip}`)
  } else {
    console.log(logMessage)
  }

  if (entry.metadata) {
    console.log('Metadata:', entry.metadata)
  }

  // In production, you might want to send this to a logging service
  // like LogRocket, DataDog, or store in a database
  if (process.env.NODE_ENV === 'production' && level === 'ERROR') {
    // Example: await sendToLoggingService(entry)
  }
}

export async function POST(req: NextRequest) {
  request = req // Store request for use in helper functions
  const startTime = performance.now()
  const clientIp = getClientIp(req)
  
  try {
    logEvent('INFO', 'Contact form submission started', { ip: clientIp })
    
    // PHASE 1: Fast validation and security checks (target: <100ms)
    
    // Check rate limiting
    if (!checkRateLimit(clientIp)) {
      logEvent('WARN', 'Rate limit exceeded', { ip: clientIp })
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const rawBody = await req.json()

    // Extract reCAPTCHA token
    const recaptchaToken = rawBody.recaptchaToken

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      logEvent('WARN', 'Missing reCAPTCHA token', { ip: clientIp })
      return NextResponse.json(
        { error: 'reCAPTCHA verification required' },
        { status: 400 }
      )
    }

    const isRecaptchaValid = await verifyRecaptcha(recaptchaToken)
    if (!isRecaptchaValid) {
      logEvent('WARN', 'reCAPTCHA verification failed', { ip: clientIp })
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Sanitize all inputs immediately
    const name = sanitizeInput(rawBody.name || '')
    const email = sanitizeInput(rawBody.email || '')
    const organization = sanitizeInput(rawBody.organization || '')
    const service = sanitizeInput(rawBody.service || '')
    const subject = sanitizeInput(rawBody.subject || '')
    const message = sanitizeInput(rawBody.message || '')

    // Validate required fields
    if (!name || !email || !organization || !service || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, organization, service, subject, and message are required' },
        { status: 400 }
      )
    }

    // Enhanced spam detection
    const combinedContent = `${name} ${email} ${organization} ${subject} ${message}`
    if (checkSpamContent(combinedContent)) {
      logEvent('WARN', 'Potential spam detected', { 
        subject: subject.substring(0, 50),
        email: email.substring(0, 20) + '***',
        patterns: spamPatterns.filter(p => p.test(combinedContent)).length
      })
      return NextResponse.json(
        { error: 'Message content appears to be spam. Please revise and try again.' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (name.length > 100 || email.length > 100 || (organization && organization.length > 150) || 
        (service && service.length > 100) || subject.length > 200 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Field length exceeded maximum allowed' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // PHASE 2: Generate submission ID and queue email processing (target: <50ms)
    
    const submissionId = generateSubmissionId()
    const contactData: ContactFormData = {
      name,
      email,
      organization,
      service,
      subject,
      message,
      userIp: clientIp
    }

    // Handle development mode
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_EMAIL_IN_DEV !== 'true') {
      console.log('📧 Development Mode - Email would be queued:')
      console.log('From:', name, '<' + email + '>')
      console.log('Subject:', subject)
      console.log('Message preview:', message.substring(0, 100) + '...')
      
      return NextResponse.json({
        success: true,
        submissionId,
        message: 'Email logged (development mode)',
        responseTime: `${Math.round(performance.now() - startTime)}ms`
      }, { status: 200 })
    }

    // Queue email for background processing (fire-and-forget)
    try {
      queueEmailProcessing(submissionId, contactData).catch(queueError => {
        logEvent('ERROR', 'Failed to queue email processing', {
          submissionId,
          error: queueError instanceof Error ? queueError.message : String(queueError)
        })
      })
    } catch (syncError) {
      logEvent('ERROR', 'Synchronous error in queue setup', {
        submissionId,
        error: syncError instanceof Error ? syncError.message : String(syncError)
      })
    }

    // PHASE 3: Immediate success response (target: <300ms total)
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    logEvent('INFO', 'Contact form submission completed successfully', {
      duration: `${duration}ms`,
      submissionId,
      email: email.substring(0, 10) + '***',
      subject: subject.substring(0, 30)
    })

    return NextResponse.json({
      success: true,
      submissionId,
      message: "Thank you for your message! We've received your inquiry and will get back to you soon. Your emails are being processed in the background.",
      responseTime: `${duration}ms`
    }, { status: 200 })

  } catch (error) {
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    logEvent('ERROR', 'Contact form submission failed', {
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack?.substring(0, 200) : undefined
    })
    
    // Return immediate error response
    return NextResponse.json(
      { 
        error: 'Failed to process your message. Please try again later.',
        responseTime: `${duration}ms`
      },
      { status: 500 }
    )
  }
}