import { NextRequest, NextResponse } from 'next/server'
import { emailQueue } from '../../../../lib/email-queue'

export async function GET(req: NextRequest) {
  try {
    const queueStatus = emailQueue.getQueueStatus()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      queue: {
        size: queueStatus.queueSize,
        processing: queueStatus.processing,
        oldestJobAge: queueStatus.oldestJob ? 
          Math.round((Date.now() - queueStatus.oldestJob.getTime()) / 1000) + 's' : 
          'N/A'
      },
      system: {
        uptime: process.uptime() + 's',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}