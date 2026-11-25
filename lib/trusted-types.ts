// The Trusted Types default policy. The CSP requires Trusted Types for scripts, so every unguarded
// sink (Next's chunk loader setting a script's src, React creating a <script>, GTM injecting its
// tags) goes through this policy. Named 'default' so the browser applies it automatically.
// createScriptURL is a real allowlist (same origin, plus Google Tag Manager, Analytics, reCAPTCHA
// and Cloudflare's beacon, matching the CSP's script-src). createHTML and createScript pass
// through: GTM's Custom HTML tags need them, and the script-URL allowlist is what limits what code
// can load.
//
// It is installed twice, on purpose, by the same function: inline at the top of every page the
// root layout renders (app/layout.tsx, before GTM), and from instrumentation-client.ts, which runs
// before React starts on every page. The second covers responses Next renders without the layout,
// such as its bare error shell when a page calls notFound(); without it React's first <script>
// there is blocked and the 404 crashes. Whichever runs first installs it; the other is a no-op.
//
// Self-contained (no imports, no outer variables): the layout inlines it with toString().

type TrustedTypes = { createPolicy: (name: string, rules: Record<string, (input: string) => string>) => unknown }

export function installTrustedTypesPolicy() {
  const tt = (window as Window & { trustedTypes?: TrustedTypes }).trustedTypes
  if (!tt || !tt.createPolicy) return
  try {
    tt.createPolicy('default', {
      createScriptURL: function (url: string) {
        // Same-origin paths: Next's chunk loader passes "/_next/static/...", not full URLs
        if (url.charAt(0) === '/' && url.charAt(1) !== '/') return url
        const allowed = [
          window.location.origin + '/',
          'https://www.googletagmanager.com/',
          'https://www.google-analytics.com/',
          'https://ssl.google-analytics.com/',
          'https://www.google.com/recaptcha/',
          'https://www.gstatic.com/recaptcha/',
          'https://static.cloudflareinsights.com/',
        ]
        for (let i = 0; i < allowed.length; i++) {
          if (url.indexOf(allowed[i]) === 0) return url
        }
        throw new Error('Blocked untrusted script URL: ' + url)
      },
      createHTML: function (html: string) { return html },
      createScript: function (script: string) { return script },
    })
  } catch {
    // Already installed by the other copy
  }
}
