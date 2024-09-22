import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface SectionProps {
  children?: ReactNode
  className?: string
  title: string
}

function Section({ children, className, title }: SectionProps) {
  return (
    <div className={cn('', className)}>
      <h2 className="mb-6 text-2xl font-light uppercase md:mb-8 md:text-4xl">
        <span className="relative">
          {title}
          <span className="absolute -bottom-3 -right-4 h-4 w-9 border-b-2 border-r-2 border-foreground bg-transparent md:border-b-[3px] md:border-r-[3px]" />
        </span>
      </h2>
      {children}
    </div>
  )
}

Section.displayName = 'Section'

export default Section
