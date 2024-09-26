import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { AdsterraHorizontalAdsBanner } from '~/components/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/adsterra/native-ads-banner'
import { Pagination } from '~/components/pagination'
import SearchForm from '~/components/search-form'
import { searchSubjects } from '~/lib/api.server/search'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const offset = Number(url.searchParams.get('offset')) || 0

  if (!q) {
    return {
      numFound: 0,
      foundExact: false,
      subjects: [],
    }
  }

  const searchRes = await searchSubjects({ q, offset })

  return {
    numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
    foundExact: searchRes?.numFoundExact ?? false,
    subjects: searchRes?.docs?.length ? searchRes.docs : [],
  }
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
