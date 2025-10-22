// Debug logger that stores logs and prevents clearing
class DebugLogger {
  private logs: Array<{ time: number; message: string; emoji: string }> = []
  private startTime: number = 0
  private debugPanel: HTMLDivElement | null = null

  init() {
    this.startTime = performance.now()
    this.logs = []

    // Create visual debug panel
    this.createDebugPanel()

    console.log('%c🔍 DEBUG LOGGER INITIALIZED', 'background: #000; color: #0f0; font-size: 16px; font-weight: bold; padding: 4px;')

    // Store in sessionStorage as backup
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('debugLogs', JSON.stringify([]))
    }
  }

  createDebugPanel() {
    if (typeof document === 'undefined') return

    // Create floating debug panel
    this.debugPanel = document.createElement('div')
    this.debugPanel.id = 'debug-panel'
    this.debugPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      max-height: 600px;
      background: rgba(0, 0, 0, 0.95);
      border: 2px solid #0f0;
      border-radius: 8px;
      padding: 16px;
      color: #fff;
      font-family: monospace;
      font-size: 11px;
      overflow-y: scroll;
      overflow-x: hidden;
      z-index: 999999;
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
      -webkit-overflow-scrolling: touch;
    `

    const header = document.createElement('div')
    header.style.cssText = `
      color: #0f0;
      font-weight: bold;
      margin-bottom: 12px;
      font-size: 14px;
      border-bottom: 1px solid #0f0;
      padding-bottom: 8px;
    `
    header.textContent = '🔍 DEBUG LOG'
    this.debugPanel.appendChild(header)

    const logsContainer = document.createElement('div')
    logsContainer.id = 'logs-container'
    this.debugPanel.appendChild(logsContainer)

    document.body.appendChild(this.debugPanel)
  }

  log(source: string, message: string, emoji: string = '📝') {
    const time = (performance.now() - this.startTime).toFixed(2)
    const logEntry = { time: parseFloat(time), message: `[${source}] ${message}`, emoji }
    this.logs.push(logEntry)

    // Add to visual panel
    if (this.debugPanel) {
      const logsContainer = this.debugPanel.querySelector('#logs-container')
      if (logsContainer) {
        const logLine = document.createElement('div')
        logLine.style.cssText = `
          margin-bottom: 4px;
          padding: 4px;
          background: rgba(0, 255, 0, 0.05);
          border-left: 2px solid #0f0;
          padding-left: 8px;
        `
        logLine.innerHTML = `
          <span style="color: #888">${emoji} ${time}ms</span>
          <span style="color: #0ff; font-weight: bold;"> [${source}]</span>
          <span style="color: #fff;"> ${message}</span>
        `
        logsContainer.appendChild(logLine)

        // Auto-scroll to bottom
        logsContainer.scrollTop = logsContainer.scrollHeight
      }
    }

    // Log to console
    console.log(
      `%c${emoji} ${time}ms %c[${source}] %c${message}`,
      'color: #888',
      'color: #0ff; font-weight: bold',
      'color: #fff'
    )

    // Store in sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('debugLogs', JSON.stringify(this.logs))
    }
  }

  printSummary() {
    console.log('\n\n')
    console.log('%c═══════════════════════════════════════════════════════', 'color: #0f0; font-weight: bold; font-size: 14px')
    console.log('%c                    DEBUG SUMMARY                      ', 'color: #0f0; font-weight: bold; font-size: 14px')
    console.log('%c═══════════════════════════════════════════════════════', 'color: #0f0; font-weight: bold; font-size: 14px')

    this.logs.forEach(({ time, message, emoji }) => {
      console.log(`%c${emoji} ${time.toString().padStart(8)}ms %c${message}`, 'color: #888', 'color: #fff')
    })

    console.log('%c═══════════════════════════════════════════════════════', 'color: #0f0; font-weight: bold; font-size: 14px')
    console.log(`%cTotal events: ${this.logs.length}`, 'color: #0ff; font-weight: bold')
    console.log('%c═══════════════════════════════════════════════════════\n\n', 'color: #0f0; font-weight: bold; font-size: 14px')

    // Add summary to panel
    if (this.debugPanel) {
      const logsContainer = this.debugPanel.querySelector('#logs-container')
      if (logsContainer) {
        const summary = document.createElement('div')
        summary.style.cssText = `
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #0f0;
          color: #0ff;
          font-weight: bold;
        `
        summary.textContent = `✅ Total events: ${this.logs.length}`
        logsContainer.appendChild(summary)
      }
    }
  }

  getLogs() {
    return this.logs
  }
}

export const debugLogger = new DebugLogger()
