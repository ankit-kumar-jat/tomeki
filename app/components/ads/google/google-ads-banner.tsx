import { useLocation } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { featureFlags } from '~/config/feature-flags'
import { GOOGLE_ADS_PUB_ID } from '~/config/ads/google'

interface GoogleAdsBannerProps {
  adSlot: string
}

function GoogleAdsBanner({ adSlot }: GoogleAdsBannerProps) {
  const [isAdPushed, setIsAdPushed] = useState(false)

  useEffect(() => {
    if (!isAdPushed) {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      setIsAdPushed(true)
    }
  }, [])

  return (
    <div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={GOOGLE_ADS_PUB_ID}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}

const GoogleAdsBannerWithFeatureFlagCheck = ({
  adSlot,
}: GoogleAdsBannerProps) => {
  if (!featureFlags.enableGoogleAds) return null

  return <GoogleAdsBanner adSlot={adSlot} />
}

export { GoogleAdsBannerWithFeatureFlagCheck as GoogleAdsBanner }
