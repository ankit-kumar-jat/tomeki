import { Link } from '@remix-run/react'
import { useMemo } from 'react'
import { getCoverImage } from '~/lib/utils'

interface WorkCardProps {
  title: string
  workId: string
  coverId?: number
  authors: {
    name: string
  }[]
}

function WorkCard({ title, coverId, authors, workId }: WorkCardProps) {
  const byString = useMemo(
    () => `By ${authors.map(({ name }) => name).toString()}`,
    [authors],
  )
  return (
    <div className="relative">
      <Link
        to={`/books/${workId}`}
        className="absolute inset-0 overflow-hidden"
        title={`${title} ${byString.toLowerCase()}`}
      >
        <span className="sr-only">
          View {title} {byString}{' '}
        </span>
      </Link>
      <div>
        {coverId ? (
          <img
            src={getCoverImage({ type: 'id', size: 'M', id: coverId })}
            alt={`Cover of ${title} ${byString.toLowerCase()}`}
            width={192}
            height={288}
            className="aspect-[2/3] h-auto w-48 max-w-full border object-cover"
          />
        ) : (
          <div className="aspect-[2/3] w-48 max-w-full bg-muted p-3">
            <div className="flex w-full items-center justify-center border-4 border-white">
              <p className="line-clamp-6 text-center capitalize text-muted-foreground">
                {title}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="max-w-48">
        <p className="mt-2 line-clamp-2 leading-5">{title}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{byString}</p>
      </div>
    </div>
  )
}

export default WorkCard
