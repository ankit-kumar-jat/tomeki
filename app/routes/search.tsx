import {
  HeadersFunction,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/cloudflare'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import SearchForm from '~/components/search-form'
import { getBlogFeed } from '~/lib/api/blogs.server'
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

  // TODO: remove body from searchRes posts and add sort decription
  return json({ ...searchRes, q }, { headers })
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
  const { posts, labels } = useLoaderData<typeof loader>()
  return (
    <div className="container my-10">
      <div className="mx-auto max-w-3xl">
        <SearchForm />
        <div className="mt-4 min-h-60 space-y-4 lg:mt-6">
          {posts.length ? (
            <>
              <p className="font-medium">Search Results</p>
              <div className="space-y-4">
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    title={post.title}
                    path={post.path}
                    published={post.published}
                    coverImage={post.coverImage}
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
}

function PostCard({
  title,
  path,
  description,
  coverImage,
  published,
}: PostCardProps) {
  return (
    <div className="flex border-b pb-4 sm:rounded-lg sm:border sm:p-3 md:p-4">
      <div className="relative hidden flex-shrink-0 sm:block">
        <img
          src={coverImage}
          alt={`Cover of ${title}`}
          width={72}
          height={72}
          className="h-auto w-[72px] rounded-lg bg-muted object-cover"
          loading="lazy"
        />

        <Link to={`/blogs${path}`} className="absolute inset-0">
          <span className="sr-only">View {title}</span>
        </Link>
      </div>
      <div className="sm:pl-4 sm:pr-2">
        <Link
          to={`/blogs${path}`}
          className="line-clamp-2 text-base sm:line-clamp-1 sm:text-lg md:text-xl"
        >
          {title}
        </Link>
        {/* <p className="mt-1 text-xs md:text-sm">
            {published}
          </p> */}
        <p className="text-sm">{description}</p>
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
