import type { LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams, json } from '@remix-run/react'
import { AdsterraHorizontalAdsBanner } from '~/components/ads/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import { Pagination } from '~/components/pagination'
import SearchForm from '~/components/search-form'
import { searchAuthors } from '~/lib/api.server/search'
import { getAuthorImage } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const offset = Number(url.searchParams.get('offset')) || 0

  const headers = { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' }

  if (!q) {
    return json(
      {
        numFound: 0,
        foundExact: false,
        authors: [],
      },
      { headers },
    )
  }

  const searchRes = await searchAuthors({
    q,
    offset,
    fields: ['name', 'key', 'top_subjects', 'work_count', 'top_work'],
  })

  return json(
    {
      numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
      foundExact: searchRes?.numFoundExact ?? false,
      authors: searchRes?.docs?.length ? searchRes.docs : [],
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export default function Index() {
  const { numFound, foundExact, authors } = useLoaderData<typeof loader>()
  return (
    <div className="grid lg:grid-cols-12">
      <div className="lg:col-span-7">
        <SearchForm placeholder="Search by author name" />
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
                {authors.map(author => (
                  <AuthorCard
                    key={author.key}
                    name={author.name}
                    authorId={author.key}
                    topSubjects={author.top_subjects?.join(', ') ?? ''}
                    topWork={author.top_work}
                    worksCount={author.work_count}
                  />
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

interface AuthorCardProps {
  authorId: string
  name: string
  worksCount: number
  topSubjects: string
  topWork: string
}

function AuthorCard({
  authorId,
  name,
  worksCount,
  topSubjects,
  topWork,
}: AuthorCardProps) {
  const authorPagePath = `/authors/${authorId}`
  return (
    <div className="flex border">
      <div className="relative flex-shrink-0 border">
        {authorId ? (
          <img
            src={getAuthorImage({
              type: 'olid',
              id: authorId,
            })}
            alt={`Image of ${name}`}
            width={100}
            height={140}
            className="aspect-[5/7] h-auto w-28 object-cover"
          />
        ) : (
          <div className="flex aspect-[5/7] h-auto w-28 bg-muted p-2">
            <div className="flex w-full items-center justify-center border-4 border-white">
              <p className="line-clamp-6 text-center capitalize text-muted-foreground">
                {name}
              </p>
            </div>
          </div>
        )}
        <Link to={authorPagePath} className="absolute inset-0">
          <span className="sr-only">View {name} details</span>
        </Link>
      </div>

      <div className="flex flex-col justify-center px-3 py-2">
        <div>
          <Link
            to={authorPagePath}
            className="line-clamp-2 text-base sm:text-lg md:text-xl"
          >
            {name}
          </Link>
        </div>
        <div>
          <p className="text-xs md:text-sm">
            <span className="font-medium">{worksCount} Books </span>
            {topSubjects ? (
              <span className="text-muted-foreground">about {topSubjects}</span>
            ) : null}
            {topWork ? (
              <>
                <span className="text-muted-foreground"> including </span>
                <span className="font-medium">{topWork}</span>
              </>
            ) : null}
          </p>
        </div>
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
        ? 'No authors directly matched your search'
        : 'Start typing to search for authors...'}
    </p>
  )
}
