import type { LoaderFunctionArgs, HeadersFunction } from '@remix-run/node'
import {
  useLoaderData,
  json,
  Link,
  useParams,
  useSearchParams,
} from '@remix-run/react'
import { Pagination } from '~/components/pagination'
import { formatWorkEditionsRes, getWorkEditions } from '~/lib/api.server/works'
import { getCoverImage } from '~/lib/utils'

const PER_PAGE_LIMT = 10

export async function loader({ request, params }: LoaderFunctionArgs) {
  const bookId = params.bookId ?? ''
  const [workId] = bookId.split(':')

  const url = new URL(request.url)
  const offset = Number(url.searchParams.get('offset')) || 0

  const headers = {
    'Cache-Control': 'public, max-age=86400, s-max-age=86400', // 24*60*60 = 86400 = 24 hours
  }

  if (!workId?.startsWith('OL') || !workId?.endsWith('W')) {
    throw json({ errorMessage: 'Invalid bookId' }, { status: 404, headers })
  }

  const workEditionsRes = await getWorkEditions({
    workId,
    offset,
    limit: PER_PAGE_LIMT,
  })
  const formattedWorkEditionsRes = formatWorkEditionsRes(workEditionsRes)
  return json(
    {
      editions: formattedWorkEditionsRes.editions,
      totalEditions: formattedWorkEditionsRes.totalEditions,
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export default function BookEditions() {
  const { editions, totalEditions } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const offset = Number(searchParams.get('offset')) || 0

  const pageStart = offset + 1
  const pageEnd = offset + PER_PAGE_LIMT

  const handlePageChange = () => {
    document.getElementById('book-naviagtion')?.scrollIntoView()
  }

  return (
    <div className="container">
      <div className="grid lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="text-sm font-medium md:text-base">
            <p>
              {pageStart}-{pageEnd > totalEditions ? totalEditions : pageEnd} of{' '}
              {totalEditions} Editions
            </p>
          </div>
          <div className="space-y-2">
            {editions.map(edition => (
              <EditionCard
                key={edition.key}
                title={edition.title}
                editionId={edition.editionId}
                coverId={edition.covers?.[0]}
                publishDate={edition.publishDate}
                subTitile={edition.subtitle}
                language={edition.languages[0]}
                publisher={edition.publisher}
                pages={edition.pagesCount}
              />
            ))}
          </div>
          <div>
            <Pagination
              totalItems={totalEditions}
              rowsPerPage={PER_PAGE_LIMT}
              onPageChange={handlePageChange}
              preventScrollReset
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          {/* This can be used to display ads */}
        </div>
      </div>
    </div>
  )
}

interface EditionCardProps {
  title: string
  editionId: string
  coverId?: number
  publishDate: string
  subTitile?: string
  language?: string
  publisher?: string
  pages?: string | number
}

function EditionCard({
  title,
  coverId,
  editionId,
  publishDate,
  subTitile,
  language,
  publisher,
  pages,
}: EditionCardProps) {
  const params = useParams()
  const bookId = params.bookId ?? ''
  const [workId] = bookId.split(':')

  const bookPath = `/books/${workId}:${editionId}`

  return (
    <div className="flex border">
      <div className="relative flex-shrink-0 border">
        {coverId ? (
          <img
            src={getCoverImage({
              type: 'id',
              size: 'M',
              id: coverId,
            })}
            alt={`Cover of ${title}`}
            width={112}
            height={198}
            className="aspect-[2/3] h-auto w-28 object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] h-auto w-28 bg-muted p-2">
            <div className="flex w-full items-center justify-center border-4 border-white">
              <p className="line-clamp-6 text-center capitalize text-muted-foreground">
                {title}
              </p>
            </div>
          </div>
        )}
        <Link to={bookPath} className="absolute inset-0">
          <span className="sr-only">View {title}</span>
        </Link>
      </div>
      <div className="flex flex-col justify-between px-3 py-2">
        <div>
          <Link to={bookPath} className="text-base sm:text-lg md:text-xl">
            <span className="line-clamp-2">{title}</span>
            {subTitile ? (
              <span className="line-clamp-2 text-sm italic opacity-70 drop-shadow-sm sm:text-base">
                {subTitile}
              </span>
            ) : null}
          </Link>
          <div className="mt-1">
            {language ? (
              <p className="text-xs md:text-sm">Language: {language}</p>
            ) : null}
            {pages ? (
              <p className="text-xs md:text-sm">Pages: {pages}</p>
            ) : null}
            {publishDate ? (
              <p className="text-xs md:text-sm">Published In: {publishDate}</p>
            ) : null}
            {publisher ? (
              <p className="text-xs md:text-sm">Publisher: {publisher}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
