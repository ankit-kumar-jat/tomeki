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
    <div className="flex flex-col gap-4 rounded-3xl border border-foreground/30 p-6 ring-foreground focus-within:ring-2">
      <div className="relative flex-shrink-0">
        <img
          src={coverImage}
          alt={`Cover image of ${title}`}
          width="320"
          height="180"
          className="aspect-video h-auto w-full flex-shrink-0 rounded-3xl bg-muted object-cover"
          loading="lazy"
        />
        <Link
          to={`${postPath}`}
          className="absolute inset-0 outline-none"
          tabIndex={-1}
          prefetch="intent"
        >
          <span className="sr-only">View {title}</span>
        </Link>
      </div>
      <div className="space-y-4">
        <Link
          to={`${postPath}`}
          prefetch="intent"
          className="text-center text-xl font-medium outline-none hover:underline focus:underline focus-visible:underline active:underline lg:text-3xl"
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
