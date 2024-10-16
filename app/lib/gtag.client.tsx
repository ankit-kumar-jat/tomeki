declare global {
  interface Window {
    gtag?: Gtag.Gtag
  }
}

const isProd = import.meta.env.PROD

export const trackEvent = (...args: Gtag.GtagCommands['event']) => {
  if (!isProd) return
  if (!window.gtag) {
    console.warn(
      'window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet.',
    )
    return
  }
  window.gtag('event', ...args)
}
