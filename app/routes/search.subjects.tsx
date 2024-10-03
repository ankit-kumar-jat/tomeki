import type {
  LoaderFunctionArgs,
  HeadersFunction,
  MetaFunction,
} from '@remix-run/node'
import { Link, useLoaderData, useSearchParams, json } from '@remix-run/react'
import { AdsterraHorizontalAdsBanner } from '~/components/ads/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import { Pagination } from '~/components/pagination'
import SearchForm from '~/components/search-form'
import { searchSubjects } from '~/lib/api/search.server'
import { getFullURL, getMetaTitle } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const offset = Number(url.searchParams.get('offset')) || 0

  const headers: ResponseInit['headers'] = {
    'Cache-Control': 'public, max-age=3600, s-max-age=3600',
  }

  if (!q) {
    return json(
      {
        numFound: 0,
        foundExact: false,
        subjects: [],
        q: '',
      },
      { headers },
    )
  }

  const searchRes = await searchSubjects({ q, offset })

  // X-Robots-Tag header will prevent search result pages from indexing
  headers['X-Robots-Tag'] = 'noindex'

  return json(
    {
      numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
      foundExact: searchRes?.numFoundExact ?? false,
      subjects: searchRes?.docs?.length ? searchRes.docs : [],
      q,
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const metaTags = [
    {
      title: getMetaTitle(
        'Find Books by List - Curated Book Lists for Every Reader',
      ),
    },
    {
      name: 'description',
      content:
        'Explore curated book lists on Tomeki. Browse through hand-picked collections of books tailored to different tastes and interests.',
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getFullURL(`/search/lists`),
    },
  ]
  // robots meta tag will prevent search result pages from indexing
  if (data?.q) metaTags.push({ name: 'robots', content: 'noinex' })

  return metaTags
}

export default function Index() {
  const { numFound, foundExact, subjects } = useLoaderData<typeof loader>()
  return (
    <div className="grid lg:grid-cols-12">
      <div className="lg:col-span-7">
        <SearchForm placeholder="Search by subject name" />
        <div className="mt-4 min-h-60 space-y-4 lg:mt-6">
          {numFound !== 0 ? (
            <>
              <div className="text-xs md:text-sm">
                <p>
                  {numFound.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  Results
                </p>
              </div>
              <div className="space-y-2">
                {subjects.map(subject => (
                  <div key={subject.key} className="border px-4 py-2">
                    <Link
                      to={`/subjects/${subject.key.split('/').pop()}`}
                      className="line-clamp-2 text-base sm:text-lg md:text-xl"
                    >
                      {subject.name}
                    </Link>
                    <p className="text-sm font-medium text-muted-foreground md:text-base">
                      {subject.work_count} Books
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Pagination totalItems={numFound} />
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
        ? 'No subjects directly matched your search'
        : 'Start typing to search for subjects...'}
    </p>
  )
}
