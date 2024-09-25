import { useEffect, useRef } from 'react'
import { cn } from '~/lib/utils'

function NativeAdsBanner({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let script: HTMLScriptElement
    if (ref.current && !ref.current.firstChild) {
      script = document.createElement('script')
      script.async = true
      script.src = `//pl24483228.cpmrevenuegate.com/fb8cd7b4855f767509167134a2cd3a2a/invoke.js`
      script.type = 'text/javascript'
      ref.current.appendChild(script)
    }
  }, [])

  return (
    <div className={cn('my-6 min-h-48 border', className)}>
      <div ref={ref} />
      <div id="container-fb8cd7b4855f767509167134a2cd3a2a" />
    </div>
  )
}

export default NativeAdsBanner
