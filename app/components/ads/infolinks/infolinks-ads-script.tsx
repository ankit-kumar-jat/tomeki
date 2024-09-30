import React, { useEffect, useRef, useState } from 'react'
import { featureFlags } from '~/config/feature-flags'

function InfolinksAdsScript() {
  const [isScriptAdded, setIsScriptAdded] = useState(false)
  const scriptDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      scriptDivRef.current &&
      !isScriptAdded &&
      featureFlags.enableInfolinksAds
    ) {
      const script = document.createElement('script')
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = `http://resources.infolinks.com/js/infolinks_main.js`
      script.type = 'text/javascript'
      scriptDivRef.current.appendChild(script)
      setIsScriptAdded(true)
    }
  }, [])

  if (!featureFlags.enableInfolinksAds) return null

  return (
    <div ref={scriptDivRef}>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `var infolinks_pid = 3426522; var infolinks_wsid = 0;`,
        }}
      />
    </div>
  )
}

export default InfolinksAdsScript
