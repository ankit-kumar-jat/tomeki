import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/cloudflare'
import type { ShouldRevalidateFunction } from '@remix-run/react'
import { json, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { StarIcon } from 'lucide-react'
import { searchWorks } from '~/lib/api/search.server'
import { getWorkById } from '~/lib/api/works.server'
import { cn, getCoverImage, getFullURL, getMetaTitle } from '~/lib/utils'

export async function loader({ params }: LoaderFunctionArgs) {
  const bookId = params.bookId ?? ''
  const [workId, editionId] = bookId.split(':')

  const headers = {
    'Cache-Control': 'public, max-age=86400, s-max-age=86400', // 24*60*60 = 86400 = 24 hours
  }

  // basic validation for workId
  if (!workId?.startsWith('OL') || !workId?.endsWith('W')) {
    throw json({ errorMessage: 'Invalid bookId' }, { status: 404, headers })
  }

  // basic validation for editionId
  if (
    editionId &&
    (!editionId?.startsWith('OL') || !editionId?.endsWith('M'))
  ) {
    throw json({ errorMessage: 'Invalid editionId' }, { status: 404, headers })
  }

  const query = [`key:/works/${workId}`]
  if (editionId) query.push(`edition_key:${editionId}`)

  const [searchRes, work] = await Promise.all([
    searchWorks({
      limit: 1,
      sort: 'ebook_access',
      lang: 'eng',
      q: query.join(' AND '),
      fields: [
        'title',
        'key',
        'cover_i',
        'cover_edition_key',
        'first_publish_year',
        'author_name',
        'author_key',
        'number_of_pages_median',
        'ratings_average',
        'ratings_count',
        'want_to_read_count',
        'currently_reading_count',
        'already_read_count',
        'subject_key',
        'place_key',
        'person_key',
        'time_key',
        'edition_key',
        'language',
        'editions',
        'editions.*',
      ],
    }),

    getWorkById({ workId: `${workId}` }),
  ])

  if (!searchRes?.numFoundExact || !searchRes?.docs?.length || !work) {
    throw json({ errorMessage: 'Invalid bookId' }, { status: 404, headers })
  }

  return json(
    {
      workId,
      work: { ...searchRes.docs[0], ...work },
      edition: searchRes.docs[0].editions.docs[0],
    },
    { headers },
  )
}

export type LoaderType = typeof loader

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  if (currentParams.bookId !== nextParams.bookId) {
    return true // only revalidate if work/edition changed
  }
  return false
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Not Found' },
      {
        name: 'description',
        content: 'You landed on a page that does not exists.',
      },
    ]
  }
  const title = `${data.work.title} by ${data.work.author_name?.toString()}`
  const desc =
    typeof data.work.description === 'string'
      ? data.work.description
      : (data.work.description?.value ?? '')

  return [
    { title: getMetaTitle(title) },
    { property: 'og:title', content: title },
    { name: 'description', content: desc },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getFullURL(`/books/${data.workId}`),
    },
  ]
}

const navLinks = [
  { to: '', title: 'Book Details', end: true },
  { to: 'editions', title: 'Editions' },
  { to: 'related', title: 'Related' },
  { to: 'lists', title: 'Lists' },
]

export default function Index() {
  const { work, edition } = useLoaderData<typeof loader>()

  const coverImageUrl =
    work.cover_i || edition.cover_i
      ? getCoverImage({ type: 'id', id: edition.cover_i ?? work.cover_i })
      : undefined

  return (
    <div className="mb-14">
      <div className="container relative mb-10 pt-20 md:mb-14 md:pt-32 lg:pt-48">
        <AdeptiveBlurBackground coverImageUrl={coverImageUrl} />

        <div className="flex gap-6 md:gap-10">
          <div className="flex-shrink-0">
            <CoverImage title={work.title} coverImageUrl={coverImageUrl} />
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="mb-2 sm:mb-4">
              <p className="hidden text-sm uppercase leading-tight tracking-wider sm:mb-2 sm:block">
                An edition of{' '}
                <span className="font-medium">
                  {work.title} ({work.first_publish_year})
                </span>
              </p>
              <h1 className="line-clamp-2 text-lg font-extrabold tracking-wide drop-shadow-md sm:text-xl md:text-3xl lg:text-4xl">
                {edition.title}
              </h1>
              {edition.subtitle ? (
                <p className="mt-2 line-clamp-2 text-sm italic opacity-70 drop-shadow-sm sm:text-base">
                  {edition.subtitle}
                </p>
              ) : null}
              <p className="mt-2 line-clamp-2 max-w-96 text-sm font-medium drop-shadow-sm sm:text-base">
                By {work.author_name?.toString() ?? ''}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex flex-shrink-0 items-center gap-1 text-sm md:text-base">
                <StarIcon
                  width={18}
                  fill="currentColor"
                  className="opacity-80"
                />
                <span className="font-medium">
                  {work.ratings_average?.toFixed(2) ?? '0'}{' '}
                </span>
                <span>({work.ratings_count ?? 0} Ratings)</span>
              </span>
              <div className="hidden flex-shrink-0 md:block">
                <BookshelvesData
                  alreadyRead={work.already_read_count}
                  currentlyReading={work.currently_reading_count}
                  wantToRead={work.want_to_read_count}
                />
              </div>
            </div>
            <div className="mt-2 hidden md:block">
              <p className="tracking-wide drop-shadow-sm">
                {/* can add someting here for large screens */}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-8 md:my-10">
        <div className="my-4 md:hidden">
          <BookshelvesData
            alreadyRead={work.already_read_count}
            currentlyReading={work.currently_reading_count}
            wantToRead={work.want_to_read_count}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          <BookStatsCard
            title="Publish Date"
            value={edition.publish_date?.[0]}
          />
          <BookStatsCard
            title="Publisher"
            value={edition.publisher?.toString()}
          />
          <BookStatsCard title="Language" value={edition.language?.[0]} />
          <BookStatsCard
            title="Pages"
            // value={edition.number_of_pages ?? work.number_of_pages_median}
            value={work.number_of_pages_median}
          />
        </div>
      </div>
      <div className="container my-4 border-b md:my-6 lg:my-8">
        <nav className="flex gap-2" id="book-naviagtion">
          {navLinks.map(({ title, ...rest }) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'border-b-[3px] border-b-transparent px-2 py-1 text-sm font-medium drop-shadow-lg md:text-base',
                  isActive && 'border-b-foreground/50',
                )
              }
              key={title}
              preventScrollReset
              {...rest}
            >
              {title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="my-6">
        <Outlet />
      </div>
    </div>
  )
}

function AdeptiveBlurBackground({ coverImageUrl = '' }) {
  return (
    <div className="absolute inset-0 -z-10">
      {coverImageUrl ? (
        <img
          className="aspect-[2/3] h-auto w-full object-fill opacity-50 blur-[100px] sm:aspect-video md:opacity-65"
          width={1280}
          height={720}
          src={coverImageUrl}
        />
      ) : (
        <div className="aspect-[2/3] h-auto w-full bg-muted-foreground opacity-60 blur-[150px] sm:aspect-video"></div>
      )}
    </div>
  )
}

interface CoverImageProps {
  coverImageUrl?: string
  title: string
}

function CoverImage({ coverImageUrl = '', title }: CoverImageProps) {
  return (
    <>
      {coverImageUrl ? (
        <img
          className="aspect-[2/3] h-auto w-24 md:w-48"
          width={192}
          height={288}
          src={coverImageUrl}
          alt={`Cover of ${title}`}
        />
      ) : (
        <div className="aspect-[2/3] w-24 bg-muted p-3 opacity-50 md:w-48">
          <div className="flex h-full w-full items-center justify-center border-4 border-white p-2">
            <p className="line-clamp-5 text-center text-sm capitalize text-muted-foreground opacity-100 md:text-lg">
              {title}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function BookshelvesData({
  wantToRead = 0,
  currentlyReading = 0,
  alreadyRead = 0,
}) {
  return (
    <div className="flex flex-nowrap items-center gap-2 text-xs md:text-sm">
      <span>
        <span className="font-medium">{wantToRead}</span>
        <span> Want to read</span>
      </span>
      <span className="h-1 w-1 rounded-full bg-foreground/70" />
      <span>
        <span className="font-medium">{currentlyReading}</span>
        <span> Currently reading</span>
      </span>
      <span className="h-1 w-1 rounded-full bg-foreground/70" />
      <span>
        <span className="font-medium">{alreadyRead}</span>
        <span> Have read</span>
      </span>
    </div>
  )
}

interface BookStatsCardProps {
  title: string
  value?: string | number
}

function BookStatsCard({ title, value }: BookStatsCardProps) {
  return (
    <div className="space-y-1 rounded-md border border-foreground/40 p-3 md:px-4">
      <p className="text-sm font-normal uppercase tracking-wide drop-shadow-md lg:text-base">
        {title}
      </p>
      <p className="line-clamp-2 text-sm font-semibold drop-shadow-md md:text-base">
        {value ? value : '-'}
      </p>
    </div>
  )
}
