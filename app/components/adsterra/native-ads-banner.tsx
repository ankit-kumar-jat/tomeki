import { useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'
import { featureFlags } from '~/config/feature-flags'

interface AdsterraNativeAdsBannerProps {
  className?: string
}

function AdsterraNativeAdsBanner({ className }: AdsterraNativeAdsBannerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && !ref.current.firstChild) {
      const script = document.createElement('script')
      script.async = true
      script.src = `//pl24483228.cpmrevenuegate.com/fb8cd7b4855f767509167134a2cd3a2a/invoke.js`
      script.type = 'text/javascript'
      ref.current.appendChild(script)
    }
  }, [])

  return (
    <div className={cn('my-6 min-h-48 overflow-hidden border', className)}>
      <div ref={ref} />
      <div id="container-fb8cd7b4855f767509167134a2cd3a2a" />
    </div>
  )
}

const AdsterraNativeAdsBannerWithFeatureFlagCheck = ({
  className,
}: AdsterraNativeAdsBannerProps) => {
  if (!featureFlags.enableAdsterraAds) return null

  return <AdsterraNativeAdsBanner className={className} />
}

export { AdsterraNativeAdsBannerWithFeatureFlagCheck as AdsterraNativeAdsBanner }
