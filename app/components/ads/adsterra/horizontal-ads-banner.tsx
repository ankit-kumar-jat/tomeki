import { useEffect, useRef } from 'react'
import { useResponsive } from '~/components/hooks/use-responsive'
import { featureFlags } from '~/config/feature-flags'

function AdsterraHorizontalAdsBanner() {
  const { isMobile } = useResponsive()

  return (
    <div className="my-6 flex h-14 flex-col items-center justify-center overflow-hidden border text-center md:h-24">
      {isMobile ? <MobileBanner /> : <DesktopBanner />}
    </div>
  )
}

function MobileBanner() {
  const banner = useRef<HTMLDivElement>(null)

  const atOptions = {
    key: '9acb1d6c929ca6572c154d80498e232e',
    format: 'iframe',
    height: 50,
    width: 320,
    params: {},
  }
  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.topcreativeformat.com/9acb1d6c929ca6572c154d80498e232e/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      banner.current.appendChild(conf)
      banner.current.appendChild(script)
    }
  }, [banner])

  return <div className="inline overflow-hidden md:hidden" ref={banner} />
}
function DesktopBanner() {
  const banner = useRef<HTMLDivElement>(null)

  const atOptions = {
    key: '9172562c0b5a705e732b2e4b30211812',
    format: 'iframe',
    height: 90,
    width: 728,
    params: {},
  }
  useEffect(() => {
    if (banner.current && !banner.current.firstChild) {
      const conf = document.createElement('script')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `//www.topcreativeformat.com/9172562c0b5a705e732b2e4b30211812/invoke.js`
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

      banner.current.appendChild(conf)
      banner.current.appendChild(script)
    }
  }, [banner])

  return <div className="hidden overflow-hidden md:inline" ref={banner} />
}

const AdsterraHorizontalAdsBannerWithFeatureFlagCheck = () => {
  if (!featureFlags.enableAdsterraAds) return null
  return <AdsterraHorizontalAdsBanner />
}

export { AdsterraHorizontalAdsBannerWithFeatureFlagCheck as AdsterraHorizontalAdsBanner }
