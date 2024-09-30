import type { LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams, json } from '@remix-run/react'
import { AdsterraHorizontalAdsBanner } from '~/components/ads/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import SearchForm from '~/components/search-form'
import { searchLists } from '~/lib/api.server/search'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  const headers = { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' }

  if (!q) {
    return json(
      {
        numFound: 0,
        lists: [],
      },
      { headers },
    )
  }

  const searchRes = await searchLists({ q, limit: 10 })

  return json(
    {
      numFound: 100,
      lists: searchRes?.docs?.length ? searchRes.docs : [],
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export default function Index() {
  const { numFound, lists } = useLoaderData<typeof loader>()
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <SearchForm placeholder="Search by list name" />
        <div className="mt-4 min-h-60 space-y-4 lg:mt-6">
          {numFound !== 0 ? (
            <>
              <div className="text-xs md:text-sm">
                <p>"Limited to 10 results for performance reasons"</p>
              </div>
              <div className="space-y-2">
                {lists.map((list, index) => (
                  <div
                    key={`${list.url}-${index}`}
                    className="border px-4 py-2"
                  >
                    <Link
                      to={`/lists/${list.url.split('/')[1]}:${list.url.split('/')[3]}`}
                      className="line-clamp-2 text-base sm:text-lg md:text-xl"
                    >
                      {list.name}
                    </Link>
                    <p className="text-sm font-medium text-muted-foreground md:text-base">
                      {list.seed_count} Books
                    </p>
                    <p className="text-sm text-muted-foreground md:text-base">
                      Last updated on{' '}
                      {list.last_update
                        ? new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }).format(new Date(list.last_update))
                        : '-'}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <NoResults />
          )}
        </div>
        <div>
          <AdsterraHorizontalAdsBanner />
          <AdsterraNativeAdsBanner />
        </div>
      </div>
      <div className="lg:col-span-5">
        {/* This can be used to display ads */}
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
        ? 'No lists directly matched your search'
        : 'Start typing to search for lists...'}
    </p>
  )
}
