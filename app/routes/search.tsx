import {
  HeadersFunction,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/cloudflare'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import SearchForm from '~/components/search-form'
import { getBlogFeed } from '~/lib/api/blogs.server'
import { trackEvent } from '~/lib/gtag.client'
import { getFullURL, getMetaTitle } from '~/lib/utils'

const RESULTS_PER_PAGE = 20

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const page = Number(url.searchParams.get('page')) || 0
  const labels = url.searchParams.getAll('label').toString()

  const headers: ResponseInit['headers'] = {
    'Cache-Control': 'public, max-age=3600, s-maxage=300',
  }

  const searchRes = await getBlogFeed({
    q: q ?? undefined,
    startIndex: page * RESULTS_PER_PAGE + 1,
    maxResults: q ? RESULTS_PER_PAGE : 0,
    labels: labels || undefined,
  })

  if (q) {
    // X-Robots-Tag header will prevent search result pages from indexing
    headers['X-Robots-Tag'] = 'noindex'
  }

  const formattedPost = searchRes.posts.map(post => ({
    ...post,
    content: undefined,
    description: post.content.match(/<(\w+)>(.*?)<\/\1>/)?.[2] ?? '',
  }))

  return json({ ...searchRes, posts: formattedPost, q }, { headers })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const metaTags = [
    { title: getMetaTitle('Search for Articles & Insights') },
    {
      name: 'description',
      content:
        "Find in-depth articles, tutorials, and insights across various topics on Tomeki Blog. Search through our extensive library to discover the content you're looking for!",
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getFullURL(`/search`),
    },
  ]
  // robots meta tag will prevent search result pages from indexing
  if (data?.q) metaTags.push({ name: 'robots', content: 'noinex' })

  return metaTags
}

export default function Search() {
  const { posts, labels, q } = useLoaderData<typeof loader>()

  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (q && resultsRef.current) {
      resultsRef.current.focus()
    }
  }, [q])

  useEffect(() => {
    if (q) {
      trackEvent('search', { search_term: q })
    }
  }, [q])

  return (
    <div className="container my-10">
      <h1 className="sr-only">Search for Articles & Insights</h1>
      <div className="mx-auto max-w-3xl">
        <SearchForm />
        <div
          className="mt-6 min-h-60 space-y-6 outline-none lg:mt-6"
          aria-live="polite"
          tabIndex={-1}
          ref={resultsRef}
        >
          {posts.length ? (
            <>
              <h2 className="font-medium sm:text-lg">
                Search Results for "{q}"
              </h2>
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    path={post.path}
                    published={post.publishedAt}
                    coverImage={post.coverImage}
                    description={post.description}
                    labels={post.labels}
                  />
                ))}
              </div>
            </>
          ) : (
            <NoResults />
          )}
        </div>
      </div>
    </div>
  )
}

interface PostCardProps {
  title: string
  path: string
  description?: string
  coverImage?: string
  published: string
  labels?: string[]
}

function PostCard({
  title,
  path,
  description,
  coverImage,
  published,
  labels,
}: PostCardProps) {
  return (
    <div className="flex items-center border-b pb-4 ring-foreground focus-within:ring-1 sm:rounded-lg sm:border sm:p-3 md:p-4">
      <div className="relative hidden flex-shrink-0 sm:block">
        <img
          src={coverImage}
          alt={`Thumbnail of ${title}`}
          width={80}
          height={80}
          className="h-auto w-20 rounded-lg bg-muted object-cover"
          loading="lazy"
        />

        <Link
          to={`/blogs${path}`}
          className="absolute inset-0 outline-none"
          tabIndex={-1}
        >
          <span className="sr-only">View {title}</span>
        </Link>
      </div>
      <div className="space-y-2 sm:pl-4 sm:pr-2">
        {labels?.length ? (
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs md:text-sm">
            {labels.map((label, index) => (
              <span
                key={label}
                className="rounded-full font-serif text-xs leading-none text-muted-foreground sm:text-sm"
              >
                {label}
                {index + 1 < labels.length ? <>, </> : ''}
              </span>
            ))}
          </p>
        ) : null}
        <Link
          to={`/blogs${path}`}
          className="line-clamp-2 text-lg font-medium outline-none sm:line-clamp-1 md:text-xl"
        >
          {title}
        </Link>
        <p className="line-clamp-3 text-sm sm:line-clamp-2">{description}</p>
      </div>
    </div>
  )
}

function NoResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  return (
    <p className="text-center">
      {query
        ? 'No books directly matched your search'
        : 'Start typing to search for books...'}
    </p>
  )
}
