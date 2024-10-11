import { Link } from '@remix-run/react'

interface PostCardProps {
  coverImage: string
  title: string
  publishedAt: string
  postPath: string
  labels: string[]
}

export function PostCard({
  coverImage,
  title,
  publishedAt,
  postPath,
  labels,
}: PostCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-foreground/30 p-6">
      <img
        src={coverImage}
        alt=""
        width="320"
        height="180"
        className="aspect-video h-auto w-full flex-shrink-0 rounded-3xl bg-muted object-cover"
        loading="lazy"
      />
      <div className="space-y-4">
        <Link
          to={`/blogs${postPath}`}
          className="text-center text-xl font-medium outline-none focus-within:underline hover:underline focus:underline active:underline lg:text-3xl"
        >
          <h2>{title}</h2>
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {labels.map(label => (
            <span
              key={label}
              className="rounded-sm bg-muted px-2 py-1 text-sm font-medium text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-auto border-t pt-4 text-right text-xs text-muted-foreground">
        {publishedAt}
      </p>
    </div>
  )
}
