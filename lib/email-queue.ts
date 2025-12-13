import * as nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

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
  private readonly MAX_ATTEMPTS = 3
  private readonly RETRY_DELAYS = [1000, 5000, 15000] // 1s, 5s, 15s
  private transporter: Transporter

  private constructor() {
    // Initialize SMTP transporter with optimized settings
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      pool: true,
      maxConnections: parseInt(process.env.SMTP_POOL_MAX_CONNECTIONS || '5'),
      maxMessages: parseInt(process.env.SMTP_POOL_MAX_MESSAGES || '100'),
      connectionTimeout: parseInt(process.env.SMTP_CONNECTION_TIMEOUT || '10000'),
      greetingTimeout: parseInt(process.env.SMTP_GREETING_TIMEOUT || '10000'),
      socketTimeout: parseInt(process.env.SMTP_SOCKET_TIMEOUT || '30000'),
      rateDelta: parseInt(process.env.SMTP_RATE_DELTA || '1000'),
      rateLimit: parseInt(process.env.SMTP_RATE_LIMIT || '3'),
    })
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
      scheduledFor: new Date()
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

      // Send emails with timeout - process in parallel for speed
      const emailResults = await Promise.allSettled([
        this.sendNotificationEmail(job.data),
        this.sendConfirmationEmail(job.data)
      ])

      // Check results
      const notificationResult = emailResults[0]
      const confirmationResult = emailResults[1]

      const notificationSuccess = notificationResult.status === 'fulfilled'
      const confirmationSuccess = confirmationResult.status === 'fulfilled'

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

  private async sendNotificationEmail(data: ContactFormData): Promise<void> {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Portfolio Contact'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || 'hello@jacquelineamoako.com',
      replyTo: data.email,
      subject: `${process.env.EMAIL_SUBJECT_PREFIX || '[Portfolio Contact]'} ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nOrganization: ${data.organization}\nService: ${data.service}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`,
      html: this.generateNotificationEmailHTML(data)
    }

    await this.sendMailWithTimeout(mailOptions, 30000) // 30s timeout for background
  }

  private async sendConfirmationEmail(data: ContactFormData): Promise<void> {
    if (process.env.SEND_CONFIRMATION_TO_SENDER !== 'true') {
      return // Skip if disabled
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Jacqueline Amoako'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: data.email,
      subject: 'Thank you for your message',
      text: `Dear ${data.name},\n\nThank you for reaching out about ${data.service}! I've received your inquiry and will get back to you within 24 hours.\n\nBest regards,\nJacqueline Amoako`,
      html: this.generateConfirmationEmailHTML(data)
    }

    await this.sendMailWithTimeout(mailOptions, 30000) // 30s timeout for background
  }

  private async sendMailWithTimeout(mailOptions: Record<string, unknown>, timeoutMs: number): Promise<unknown> {
    return Promise.race([
      this.transporter.sendMail(mailOptions),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Email sending timed out after ${timeoutMs}ms`)), timeoutMs)
      )
    ])
  }

  private generateNotificationEmailHTML(data: ContactFormData): string {
    const sanitize = (text: string) => text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')

    return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <title>New Contact Inquiry</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style type="text/css">
            @media (prefers-color-scheme: dark) {
              .dark-mode-bg { background-color: #1a1a1a !important; }
              .dark-mode-text { color: #ffffff !important; }
              .dark-mode-text-secondary { color: #b3b3b3 !important; }
              .dark-mode-border { border-color: #333333 !important; }
              .dark-mode-card { background-color: #2a2a2a !important; }
            }
            @media only screen and (max-width: 600px) {
              .mobile-padding { padding: 60px 20px !important; }
              .mobile-text { font-size: 24px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #ffffff;" class="dark-mode-bg">
          <!--[if mso]>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
          <![endif]-->
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;" class="dark-mode-bg">
            <tr>
              <td align="center" style="padding: 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="padding: 120px 60px; text-align: center;" class="mobile-padding">
                      
                      <!-- Header Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 80px; border-bottom: 1px solid #f5f5f5;" class="dark-mode-border">
                            <h1 style="margin: 0 0 20px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 32px; line-height: 1.2; letter-spacing: 0.05em; color: #000000; text-align: center;" class="mobile-text dark-mode-text">
                              New Contact Inquiry
                            </h1>
                            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 18px; color: #666666; letter-spacing: 0.01em;" class="dark-mode-text-secondary">
                              Received ${new Date().toLocaleString()}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Contact Information Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 80px 0;">
                        <tr>
                          <td style="text-align: left;">
                            <h2 style="margin: 0 0 40px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 22px; line-height: 1.3; letter-spacing: 0.02em; color: #000000;" class="dark-mode-text">
                              Contact Information
                            </h2>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 12px;" class="dark-mode-card">
                              <tr>
                                <td style="padding: 60px 50px;">
                                  
                                  <!-- Name -->
                                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                      <td style="padding-bottom: 25px;">
                                        <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                          Name
                                        </p>
                                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                          ${sanitize(data.name)}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding-bottom: 25px;">
                                        <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                          Email
                                        </p>
                                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                          <a href="mailto:${sanitize(data.email)}" style="color: #000000; text-decoration: none;" class="dark-mode-text">${sanitize(data.email)}</a>
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding-bottom: 25px;">
                                        <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                          Organization
                                        </p>
                                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                          ${sanitize(data.organization)}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding-bottom: 25px;">
                                        <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                          Service Interest
                                        </p>
                                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                          ${sanitize(data.service)}
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style="padding-bottom: 0;">
                                        <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                          Subject
                                        </p>
                                        <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                          ${sanitize(data.subject)}
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                  
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 80px;">
                        <tr>
                          <td style="text-align: left;">
                            <h2 style="margin: 0 0 30px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 22px; line-height: 1.3; letter-spacing: 0.02em; color: #000000;" class="dark-mode-text">
                              Message
                            </h2>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 8px;" class="dark-mode-card dark-mode-border">
                              <tr>
                                <td style="padding: 50px;">
                                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 18px; line-height: 1.7; color: #000000; white-space: pre-wrap;" class="dark-mode-text">
                                    ${sanitize(data.message)}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Footer -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="border-top: 1px solid #f0f0f0; padding-top: 50px; text-align: center;" class="dark-mode-border">
                            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 16px; line-height: 1.6; color: #999999;" class="dark-mode-text-secondary">
                              Generated from your portfolio contact form
                              ${data.userIp ? `<br>Sender IP: ${data.userIp}` : ''}
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!--[if mso]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </body>
      </html>
    `
  }

  private generateConfirmationEmailHTML(data: ContactFormData): string {
    const sanitize = (text: string) => text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <title>Thank you for your message</title>
          <!--[if mso]>
          <noscript>
            <xml>
              <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
          </noscript>
          <![endif]-->
          <style type="text/css">
            @media (prefers-color-scheme: dark) {
              .dark-mode-bg { background-color: #1a1a1a !important; }
              .dark-mode-text { color: #ffffff !important; }
              .dark-mode-text-secondary { color: #b3b3b3 !important; }
              .dark-mode-border { border-color: #333333 !important; }
              .dark-mode-card { background-color: #2a2a2a !important; }
            }
            @media only screen and (max-width: 600px) {
              .mobile-padding { padding: 60px 20px !important; }
              .mobile-text { font-size: 28px !important; }
            }
          </style>
        </head>
        <body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #ffffff;" class="dark-mode-bg">
          <!--[if mso]>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr>
              <td>
          <![endif]-->
          
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff;" class="dark-mode-bg">
            <tr>
              <td align="center" style="padding: 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto;">
                  <tr>
                    <td style="padding: 120px 60px; text-align: center;" class="mobile-padding">
                      
                      <!-- Header Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="padding-bottom: 80px;">
                            <h1 style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 36px; line-height: 1.2; letter-spacing: 0.08em; color: #000000; text-align: center;" class="mobile-text dark-mode-text">
                              Thank You For Your Request
                            </h1>
                            <div style="margin-top: 50px;">
                              <p style="margin: 0 0 25px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 20px; line-height: 1.6; color: #000000; letter-spacing: 0.02em;" class="dark-mode-text">
                                Hi ${sanitize(data.name)}, I've received your inquiry about <span style="font-weight: 500;">${sanitize(data.service)}</span> and appreciate you reaching out.
                              </p>
                              <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 22px; line-height: 1.6; color: #666666; letter-spacing: 0.01em;" class="dark-mode-text-secondary">
                                I'll review your message and get back to you within 24 hours.
                              </p>
                            </div>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Inquiry Summary Card -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 80px;">
                        <tr>
                          <td style="background-color: #fafafa; padding: 60px 50px; border-radius: 12px;" class="dark-mode-card">
                            <h2 style="margin: 0 0 35px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 600; font-size: 18px; color: #999999; text-transform: uppercase; letter-spacing: 0.15em; text-align: center;" class="dark-mode-text-secondary">
                              Your Inquiry
                            </h2>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td style="padding-bottom: 25px;">
                                  <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                    Subject
                                  </p>
                                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                    ${sanitize(data.subject)}
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 25px;">
                                  <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                    Service
                                  </p>
                                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                    ${sanitize(data.service)}
                                  </p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 0;">
                                  <p style="margin: 0 0 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 17px; color: #666666; text-transform: uppercase; letter-spacing: 0.1em;" class="dark-mode-text-secondary">
                                    Submitted
                                  </p>
                                  <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 19px; color: #000000; line-height: 1.4;" class="dark-mode-text">
                                    ${new Date().toLocaleString()}
                                  </p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Signature Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 80px;">
                            <p style="margin: 0 0 12px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 18px; line-height: 1.5; color: #666666; letter-spacing: 0.01em;" class="dark-mode-text-secondary">
                              Best regards,
                            </p>
                            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; font-size: 20px; line-height: 1.3; letter-spacing: 0.03em; color: #000000;" class="dark-mode-text">
                              Jacqueline
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Contact Information -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="border-top: 1px solid #f0f0f0; padding-top: 60px; text-align: center;" class="dark-mode-border">
                            <p style="margin: 0 0 30px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 22px; line-height: 1.5; color: #666666; letter-spacing: 0.01em;" class="dark-mode-text-secondary">
                              Feel free to reach out directly if you have any questions:
                            </p>
                            <p style="margin: 0 0 15px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 400; font-size: 18px; line-height: 1.4; color: #000000;" class="dark-mode-text">
                              <a href="mailto:hello@jacquelineamoako.com" style="color: #000000; text-decoration: none; letter-spacing: 0.01em;" class="dark-mode-text">hello@jacquelineamoako.com</a>
                            </p>
                            <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; font-size: 20px; line-height: 1.4; color: #999999;" class="dark-mode-text-secondary">
                              Portfolio: <a href="https://jacquelineamoako.com" style="color: #666666; text-decoration: none; letter-spacing: 0.01em;" class="dark-mode-text-secondary">jacquelineamoako.com</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!--[if mso]>
              </td>
            </tr>
          </table>
          <![endif]-->
        </body>
      </html>
    `
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