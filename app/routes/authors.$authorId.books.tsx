import type { LoaderFunctionArgs, HeadersFunction } from '@remix-run/cloudflare'
import { json, Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { Pagination } from '~/components/pagination'
import { getWorksByAuthorId } from '~/lib/api/authors.server'
import { getCoverImage } from '~/lib/utils'

const PER_PAGE_LIMT = 10

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authorId = `${params.authorId}`

  const url = new URL(request.url)
  const offset = Number(url.searchParams.get('offset')) || 0

  const headers: ResponseInit['headers'] = {
    'Cache-Control': 'public, max-age=86400, s-max-age=86400', // 24*60*60 = 86400 = 24 hours
  }

  const worksRes = await getWorksByAuthorId({
    authorId,
    offset,
    limit: PER_PAGE_LIMT,
  })

  return json(
    {
      works: worksRes?.entries ?? [],
      totalWorks: worksRes?.size ?? 0,
      authorId,
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export default function AuthorBooks() {
  const { works, totalWorks } = useLoaderData<typeof loader>()
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
              {pageStart}-{pageEnd > totalWorks ? totalWorks : pageEnd} of{' '}
              {totalWorks} Editions
            </p>
          </div>
          <div className="space-y-2">
            {works.map(work => (
              <WorkCard
                key={work.key}
                title={work.title}
                coverId={work.covers?.[0]}
                workId={work.key.split('/').pop() ?? ''}
              />
            ))}
          </div>
          <div>
            <Pagination
              totalItems={totalWorks}
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

interface WorkCardProps {
  title: string
  coverId?: number
  subTitile?: string
  workId: string
}

function WorkCard({ title, coverId, workId, subTitile }: WorkCardProps) {
  const bookPath = `/books/${workId}`

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
        </div>
      </div>
    </div>
  )
}
