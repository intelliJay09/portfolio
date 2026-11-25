import { Resend } from 'resend'
import { notificationEmail, confirmationEmail, CONFIRMATION_SUBJECT } from './contact-email'

// Types for email queue system
export interface ContactFormData {
  name: string
  email: string
  organization: string
  service: string
  subject: string
  message: string
  userIp?: string
}

interface EmailJob {
  id: string
  data: ContactFormData
  attempts: number
  createdAt: Date
  scheduledFor: Date
  // Which of the two emails have gone out. A retry sends only what is still missing, so a
  // flaky mail server never makes Jacqueline or the sender get the same email twice.
  sent: { notification: boolean; confirmation: boolean }
}

export type ContactSubmissionStatus = 
  | 'received'
  | 'processing_email' 
  | 'email_sent_success'
  | 'email_retry_scheduled'
  | 'email_failed_final'
  | 'validation_failed'

// Background email queue with retry logic
class EmailQueue {
  private static instance: EmailQueue
  private jobs: Map<string, EmailJob> = new Map()
  private processing = false
  // Each email gets five tries over about a minute (a network blip or a Resend rate limit)
  private readonly MAX_ATTEMPTS = 5
  private readonly RETRY_DELAYS = [2000, 5000, 15000, 30000] // 2s, 5s, 15s, 30s
  // Resend sends both emails, from the verified jacquelineamoako.com domain (DKIM-signed, so
  // the domain's strict DMARC passes). No key, no sending: the route fails loudly instead.
  private resend: Resend
  private from: string

  private constructor() {
    const key = process.env.RESEND_API_KEY
    const from = process.env.EMAIL_FROM
    if (!key) throw new Error('RESEND_API_KEY is not set')
    if (!from || !from.endsWith('@jacquelineamoako.com')) throw new Error('EMAIL_FROM must be an address on jacquelineamoako.com, the domain verified in Resend')
    this.resend = new Resend(key)
    this.from = from
  }

  static getInstance(): EmailQueue {
    if (!EmailQueue.instance) {
      EmailQueue.instance = new EmailQueue()
    }
    return EmailQueue.instance
  }

  async queueEmail(submissionId: string, data: ContactFormData): Promise<void> {
    const job: EmailJob = {
      id: submissionId,
      data,
      attempts: 0,
      createdAt: new Date(),
      scheduledFor: new Date(),
      sent: { notification: false, confirmation: false },
    }

    this.jobs.set(submissionId, job)
    
    // Start processing if not already running
    if (!this.processing) {
      // Use setImmediate to avoid blocking the response
      setImmediate(() => this.startProcessing())
    }
    
    // Log queue operation
    this.logEvent('INFO', `Queued email job: ${submissionId}`, {
      email: data.email.substring(0, 10) + '***',
      subject: data.subject.substring(0, 30)
    })
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return
    
    this.processing = true
    this.logEvent('INFO', 'Started background email processing')

    while (this.jobs.size > 0) {
      const now = new Date()
      const readyJobs = Array.from(this.jobs.values())
        .filter(job => job.scheduledFor <= now)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

      if (readyJobs.length === 0) {
        // Wait 2 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }

      const job = readyJobs[0]
      await this.processJob(job)
    }

    this.processing = false
    this.logEvent('INFO', 'Stopped background email processing')
  }

  private async processJob(job: EmailJob): Promise<void> {
    try {
      this.logEvent('INFO', `Processing job: ${job.id}, attempt: ${job.attempts + 1}`)
      
      // Update audit log
      await this.logContactSubmission(job.id, job.data, 'processing_email')

      // Send whichever emails have not gone out yet, in parallel
      const [notificationResult, confirmationResult] = await Promise.allSettled([
        job.sent.notification ? Promise.resolve() : this.sendNotificationEmail(job),
        job.sent.confirmation ? Promise.resolve() : this.sendConfirmationEmail(job),
      ])

      const notificationSuccess = notificationResult.status === 'fulfilled'
      const confirmationSuccess = confirmationResult.status === 'fulfilled'
      job.sent.notification = notificationSuccess
      job.sent.confirmation = confirmationSuccess

      if (notificationSuccess && confirmationSuccess) {
        // Complete success - remove job and log
        this.jobs.delete(job.id)
        await this.logContactSubmission(job.id, job.data, 'email_sent_success')
        this.logEvent('INFO', `Successfully processed job: ${job.id}`)
      } else {
        // Handle partial or complete failures
        const errors = []
        if (!notificationSuccess) {
          errors.push(`Notification: ${(notificationResult as PromiseRejectedResult).reason}`)
        }
        if (!confirmationSuccess) {
          errors.push(`Confirmation: ${(confirmationResult as PromiseRejectedResult).reason}`)
        }
        throw new Error(`Email sending failed: ${errors.join(', ')}`)
      }

    } catch (error) {
      await this.handleJobError(job, error)
    }
  }

  private async handleJobError(job: EmailJob, error: Error | unknown): Promise<void> {
    job.attempts++
    
    this.logEvent('ERROR', `Job ${job.id} failed (attempt ${job.attempts}/${this.MAX_ATTEMPTS})`, {
      error: error instanceof Error ? error.message : String(error)
    })
    
    if (job.attempts >= this.MAX_ATTEMPTS) {
      // Max attempts reached - remove job and log failure
      this.jobs.delete(job.id)
      await this.logContactSubmission(job.id, job.data, 'email_failed_final', error instanceof Error ? error.message : String(error))
      
      // Send alert to admin about email failure
      await this.notifyAdminOfEmailFailure(job.id, job.data, error)
    } else {
      // Schedule retry
      const retryDelay = this.RETRY_DELAYS[job.attempts - 1] || 15000
      job.scheduledFor = new Date(Date.now() + retryDelay)
      
      await this.logContactSubmission(job.id, job.data, 'email_retry_scheduled', 
        `Retry ${job.attempts}/${this.MAX_ATTEMPTS} in ${retryDelay}ms`)
    }
  }

  private async sendNotificationEmail(job: EmailJob): Promise<void> {
    const { data } = job
    await this.send(`${job.id}-notification`, {
      from: `${process.env.EMAIL_FROM_NAME || 'Jacqueline Amoako'} <${this.from}>`,
      to: process.env.EMAIL_TO || 'hello@jacquelineamoako.com',
      replyTo: data.email,
      subject: `${process.env.EMAIL_SUBJECT_PREFIX || '[Portfolio Contact]'} ${data.subject}`,
      ...notificationEmail(data),
    })
  }

  private async sendConfirmationEmail(job: EmailJob): Promise<void> {
    if (process.env.SEND_CONFIRMATION_TO_SENDER !== 'true') {
      return // Skip if disabled
    }
    await this.send(`${job.id}-confirmation`, {
      from: `${process.env.EMAIL_FROM_NAME || 'Jacqueline Amoako'} <${this.from}>`,
      to: job.data.email,
      replyTo: this.from,
      subject: CONFIRMATION_SUBJECT,
      ...confirmationEmail(job.data),
    })
  }

  // One email through Resend. The idempotency key (submission plus which email) means a retry
  // after a lost response can never deliver the same email twice. Resend reports failure in
  // `error` instead of throwing, so it is thrown here for the queue's retry to catch.
  private async send(idempotencyKey: string, email: { from: string; to: string; replyTo: string; subject: string; html: string; text: string }): Promise<void> {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Resend did not answer within 30s')), 30000))
    const { error } = await Promise.race([this.resend.emails.send(email, { idempotencyKey }), timeout])
    if (error) throw new Error(`Resend ${error.name}: ${error.message}`)
  }

  private async notifyAdminOfEmailFailure(submissionId: string, data: ContactFormData, error: Error | unknown): Promise<void> {
    try {
      this.logEvent('ERROR', `ADMIN ALERT: Email delivery failed for submission ${submissionId}`, {
        email: data.email.substring(0, 10) + '***',
        subject: data.subject.substring(0, 30),
        error: error instanceof Error ? error.message : String(error),
        attempts: this.MAX_ATTEMPTS
      })
      
      // In production, you might want to send this to a different notification service
      // like Slack, SMS, or a monitoring system
    } catch (alertError) {
      this.logEvent('ERROR', 'Failed to send admin alert', { error: alertError instanceof Error ? alertError.message : String(alertError) })
    }
  }

  private async logContactSubmission(
    submissionId: string,
    data: ContactFormData,
    status: ContactSubmissionStatus,
    details?: string
  ): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      submissionId,
      status,
      email: data.email.substring(0, 15) + '***',
      subject: data.subject.substring(0, 40),
      details,
      userIp: data.userIp
    }

    this.logEvent('INFO', `Contact submission: ${status}`, logEntry)
  }

  private logEvent(level: 'INFO' | 'WARN' | 'ERROR', message: string, metadata?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [EmailQueue] ${level}: ${message}`
    
    if (level === 'ERROR') {
      console.error(logMessage, metadata || '')
    } else if (level === 'WARN') {
      console.warn(logMessage, metadata || '')
    } else {
      console.log(logMessage, metadata || '')
    }
  }

  // Public methods for monitoring
  getQueueSize(): number {
    return this.jobs.size
  }

  isProcessing(): boolean {
    return this.processing
  }

  getQueueStatus(): { queueSize: number; processing: boolean; oldestJob?: Date } {
    const jobs = Array.from(this.jobs.values())
    const oldestJob = jobs.length > 0 ? jobs.reduce((oldest, job) => 
      job.createdAt < oldest.createdAt ? job : oldest
    ).createdAt : undefined

    return {
      queueSize: this.jobs.size,
      processing: this.processing,
      oldestJob
    }
  }
}

// Export singleton instance and helper functions
export const emailQueue = EmailQueue.getInstance()

// Helper function to generate unique submission IDs
export function generateSubmissionId(): string {
  return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Helper function for API route
export async function queueEmailProcessing(submissionId: string, data: ContactFormData): Promise<void> {
  return emailQueue.queueEmail(submissionId, data)
}