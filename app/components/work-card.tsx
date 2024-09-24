import { useMemo } from 'react'
import { getCoverImage } from '~/lib/utils'

interface WorkCardProps {
  title: string
  key: string
  coverId: number
  authors: {
    name: string
  }[]
}

function WorkCard({ title, coverId, authors }: WorkCardProps) {
  const byString = useMemo(
    () => `By ${authors.map(({ name }) => name).toString()}`,
    [authors],
  )
  return (
    <div>
      <img
        src={getCoverImage({ type: 'id', size: 'M', id: coverId })}
        alt={`Cover of ${title} ${byString.toLowerCase()}`}
        width={192}
        height={288}
        className="aspect-[2/3] h-auto w-48 max-w-full object-cover"
      />
      <div>
        <p className="mt-2 line-clamp-2 leading-5" title={title}>
          {title}
        </p>
        <p
          className="line-clamp-2 text-sm text-muted-foreground"
          title={byString}
        >
          {byString}
        </p>
      </div>
    </div>
  )
}

export default WorkCard
