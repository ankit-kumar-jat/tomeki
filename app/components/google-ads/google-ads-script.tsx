import { useEffect, useRef } from 'react'
import { featureFlags } from '~/config/feature-flags'
import { GOOGLE_ADS_PUB_ID, GOOGLE_ADS_SCRIPT_ID } from '~/config/google-ads'

// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6892126566030270"
// crossorigin="anonymous"></script>

function GoogleAdsScript() {
  const scriptDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      scriptDivRef.current &&
      !scriptDivRef.current.firstChild &&
      featureFlags.enableGoogleAds
    ) {
      const script = document.createElement('script')
      if (process.env.NODE_ENV === 'development') {
        script.setAttribute('data-adbreak-test', 'on')
      }
      script.async = true
      script.id = GOOGLE_ADS_SCRIPT_ID
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_PUB_ID}`
      script.type = 'text/javascript'
      scriptDivRef.current.appendChild(script)
    }
  }, [])

  if (!featureFlags.enableGoogleAds) return null

  return <div ref={scriptDivRef} />
}

export default GoogleAdsScript
