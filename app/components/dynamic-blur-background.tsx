import { useMemo } from 'react'
import { ClientOnly } from 'remix-utils/client-only'

const colors = [
  '#c8553d',
  '#F28F3B',
  '#588B8B',
  '#ACE894',
  '#433633',
  '#dc2626',
  '#d97706',
  '#0891b2',
  '#e11d48',
]

function DynamicBlurBackground() {
  const radomColor = useMemo(
    () => colors[Math.floor(Math.random() * colors.length)],
    [],
  )

  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="h-full w-full rounded-3xl opacity-40 blur-[170px] transition-colors duration-300 sm:rounded-none md:blur-[100px]"
        style={{ backgroundColor: radomColor }}
      ></div>
    </div>
  )
}

const WithClientOnly = () => {
  return <ClientOnly>{() => <DynamicBlurBackground />}</ClientOnly>
}

export { WithClientOnly as DynamicBlurBackground }
