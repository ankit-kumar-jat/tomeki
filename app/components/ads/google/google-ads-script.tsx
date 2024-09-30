import { useEffect, useRef, useState } from 'react'
import { featureFlags } from '~/config/feature-flags'
import { GOOGLE_ADS_PUB_ID, GOOGLE_ADS_SCRIPT_ID } from '~/config/ads/google'

// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6892126566030270"
// crossorigin="anonymous"></script>

function GoogleAdsScript() {
  const [isScriptAdded, setIsScriptAdded] = useState(false)
  const scriptDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      scriptDivRef.current &&
      !isScriptAdded &&
      featureFlags.enableGoogleAds
    ) {
      const script = document.createElement('script')
      script.async = true
      script.id = GOOGLE_ADS_SCRIPT_ID
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${GOOGLE_ADS_PUB_ID}`
      script.type = 'text/javascript'
      scriptDivRef.current.appendChild(script)
      setIsScriptAdded(true)
    }
  }, [])

  if (!featureFlags.enableGoogleAds) return null

  return <div ref={scriptDivRef} />
}

export default GoogleAdsScript
