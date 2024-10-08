import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
  MetaDescriptor,
} from '@remix-run/cloudflare'
import {
  json,
  Link,
  useFetcher,
  useLoaderData,
  useSearchParams,
} from '@remix-run/react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { SITE_NAME } from '~/config/site'
import { getBlogLabels, getBlogPosts } from '~/lib/api/blogs.server'
import { cn } from '~/lib/utils'
import { NewsletterSubscriptionForm } from '~/routes/resources.convert-kit'

export async function loader({ request, context }: LoaderFunctionArgs) {
  const apiKey = context.cloudflare.env.BLOGGER_API_KEY
  if (!apiKey) throw Error('API key not found!')

  const url = new URL(request.url)
  const labelsSelected = url.searchParams.getAll('labels')
  const nextPageToken = url.searchParams.get('next')

  const headers = { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' }

  const [postsRes, labels] = await Promise.all([
    getBlogPosts({
      key: apiKey,
      labels: labelsSelected.length ? labelsSelected.toString() : undefined,
      maxResults: 18,
      pageToken: nextPageToken ?? undefined,
    }),
    getBlogLabels(),
  ])

  return json(
    {
      nextPageToken: postsRes.nextPageToken,
      posts: postsRes.posts,
      labels,
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const metaTags: MetaDescriptor[] = [
    {
      title: `Latest Updates, Reviews and Book Discoveries | ${SITE_NAME} Blog`,
    },
    {
      name: 'description',
      content: `Stay updated with the latest book trends, recommendations, and reading tips. Explore the ${SITE_NAME} blog for insightful posts on new releases, book reviews, and more.`,
    },
  ]

  if (data?.posts?.length) {
    data?.posts.slice(0, 3).forEach(post => {
      if (post.coverImage) {
        metaTags.push({
          tagName: 'link',
          rel: 'preload',
          href: post.coverImage,
          as: 'image',
        })
      }
    })
  }

  return metaTags
}

export default function Blogs() {
  const { nextPageToken, posts, labels } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const labelsSelected = searchParams.getAll('labels')

  const [morePosts, setMorePosts] = useState<typeof posts>([])
  const fetcher = useFetcher<typeof loader>()

  const actualNextPageToken = fetcher.data
    ? fetcher.data.nextPageToken
    : nextPageToken

  const handleLabelSelect = (value: string) => {
    setSearchParams(
      prev => {
        if (prev.has('labels', value)) {
          prev.delete('labels', value)
        } else {
          prev.append('labels', value)
        }
        setMorePosts([])
        return prev
      },
      { preventScrollReset: true },
    )
  }

  const handleLoadMore = (next: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('next', next)
    fetcher.load(`/blogs?${params.toString()}`)
  }

  useEffect(() => {
    if (fetcher.data?.posts?.length) {
      const newPosts = fetcher.data.posts
      setMorePosts(prev => [...prev, ...newPosts])
    }
  }, [fetcher.data])

  const combinedPosts = useMemo(
    () => [...posts, ...morePosts],
    [posts, morePosts],
  )

  return (
    <div className="container my-10">
      <div className="space-y-4 py-10 text-center md:py-14">
        <h1 className="text-balance text-3xl drop-shadow-md sm:text-5xl">
          Blog
        </h1>
        <p className="mx-auto max-w-lg text-balance text-base font-medium text-muted-foreground md:text-lg">
          Explore the World of Books with {SITE_NAME}: Insights, Reviews, and
          Recommendations.
        </p>
      </div>
      <div className="mb-10 mt-4 space-y-4 md:mb-14">
        <p className="text-base font-medium md:text-lg">
          Search blog by topics
        </p>
        <div className="flex max-w-4xl flex-wrap items-center gap-2">
          {labels.map(label => (
            <Button
              variant="outline"
              size="sm"
              key={label}
              className={cn(
                'rounded-full',
                labelsSelected.includes(label) &&
                  'border-foreground/30 bg-muted',
              )}
              onClick={() => handleLabelSelect(label)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div className="my-10">
        {posts.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {combinedPosts.map(post => (
                <PostCard
                  key={post.id}
                  coverImage={post.coverImage}
                  title={post.title}
                  publishedAt={post.published}
                  postPath={post.path}
                  labels={post.labels}
                />
              ))}
            </div>
            <div className="my-6 text-center">
              {actualNextPageToken ? (
                <Button
                  // variant="outline"
                  onClick={() => handleLoadMore(actualNextPageToken)}
                  disabled={fetcher.state !== 'idle'}
                  className="min-w-32"
                >
                  {fetcher.state !== 'idle' ? 'Loading...' : 'Load More'}
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <p className="min-h-60 text-lg font-medium text-muted-foreground md:text-xl">
            Couldn't find anything to match your criteria. Sorry.
          </p>
        )}
      </div>
      <div>
        <NewsletterSubscriptionForm />
      </div>
    </div>
  )
}

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
    <div className="rounded-3xl border border-foreground/30 p-6">
      <img
        src={coverImage}
        alt=""
        width="320"
        height="180"
        className="aspect-video h-auto w-full rounded-3xl bg-muted object-cover"
        loading="lazy"
      />
      <div className="mt-4 space-y-4">
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
        <p className="border-t pt-4 text-right text-xs text-muted-foreground">
          {publishedAt}
        </p>
      </div>
    </div>
  )
}
