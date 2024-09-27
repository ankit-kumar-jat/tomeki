import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/node'
import { json, Link, useLoaderData } from '@remix-run/react'
import { StarIcon } from 'lucide-react'
import { searchWorks } from '~/lib/api.server/search'
import { getWorkById } from '~/lib/api.server/works'
import { getCoverImage } from '~/lib/utils'

export async function loader({ params }: LoaderFunctionArgs) {
  const { workId } = params

  const [searchRes, work] = await Promise.all([
    searchWorks({
      q: `key:"/works/${workId}"`,
      fields: [
        'title',
        'key',
        'cover_i',
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
      ],
    }),

    getWorkById({ workId: `${workId}` }),
  ])

  if (!searchRes?.numFoundExact || !work) {
    throw json({ errorMessage: 'Invalid bookId' }, { status: 404 })
  }

  return json(
    { work: { ...searchRes.docs[0], ...work } },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-max-age=86400', // 24*60*60 = 86400 = 24 hours
      },
    },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return data
    ? [
        {
          title: `${data.work.title} by ${data.work.author_name?.join(', ')} | Novalla`,
        },
        {
          name: 'description',
          content:
            typeof data.work.description === 'string'
              ? data.work.description
              : (data.work.description?.value ?? ''),
        },
      ]
    : [
        { title: 'Not Found' },
        {
          name: 'description',
          content: 'You landed on a page that does not exists.',
        },
      ]
}

export default function Index() {
  const { work } = useLoaderData<typeof loader>()
  const coverImageUrl = work.cover_i
    ? getCoverImage({ type: 'id', id: work.cover_i })
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
              <h1 className="line-clamp-2 text-lg font-extrabold tracking-wide drop-shadow-md sm:text-xl md:text-3xl lg:text-4xl">
                {work.title}
              </h1>
              <p className="mt-2 line-clamp-2 max-w-96 text-sm font-medium drop-shadow-sm sm:text-base">
                By {work.author_name?.toString() ?? ''}
              </p>
            </div>
            <p className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide opacity-70 md:text-sm">
              <span>{work.first_publish_year}</span>
              <span className="h-1 w-1 rounded-full bg-foreground" />
              <span>{work.number_of_pages_median} pages</span>
            </p>
            <div className="flex flex-wrap items-center gap-3">
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
      <div className="container my-10 border-t lg:mb-14">
        <div className="space-y-8">
          {/* ========== description ============== */}
          <div className="space-y-2 pt-4">
            <p>
              <strong>Description:</strong>
            </p>
            <p className="text-sm leading-snug md:text-base md:leading-snug">
              {typeof work.description === 'string'
                ? work.description
                : work.description?.value}
            </p>
          </div>
          {/* ========== Subjects ============== */}
          <div className="space-y-4 border-t pt-4">
            <RendarSubjects
              subjectKeys={work.subject_key}
              subjects={work.subjects}
              type="subject"
              title="subjects"
            />
            <RendarSubjects
              subjectKeys={work.person_key}
              subjects={work.subject_people}
              type="person"
              title="People"
            />
            <RendarSubjects
              subjectKeys={work.place_key}
              subjects={work.subject_places}
              type="place"
              title="Places"
            />
            <RendarSubjects
              subjectKeys={work.time_key}
              subjects={work.subject_times}
              type="time"
              title="Times"
            />
          </div>
        </div>
        <div className="container my-10 border-t lg:mb-14"></div>
      </div>
    </div>
  )
}

function AdeptiveBlurBackground({ coverImageUrl = '' }) {
  return (
    <div className="absolute inset-0 -z-10">
      {coverImageUrl ? (
        <img
          className="aspect-[2/3] h-auto w-full object-fill opacity-75 blur-[60px] sm:aspect-video md:blur-[80px] lg:blur-[100px]"
          width={1280}
          height={720}
          src={coverImageUrl}
        />
      ) : (
        <div className="aspect-[2/3] h-auto w-full bg-muted-foreground opacity-75 blur-[80px] sm:aspect-video md:blur-[100px] lg:blur-[160px]"></div>
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
      <span>{wantToRead} Want to read</span>
      <span className="h-1 w-1 rounded-full bg-foreground/70" />
      <span>{currentlyReading} Currently reading</span>
      <span className="h-1 w-1 rounded-full bg-foreground/70" />
      <span>{alreadyRead} Have read</span>
    </div>
  )
}

type SubjectType = 'subject' | 'place' | 'time' | 'person'
interface RendarSubjectsProps {
  subjects?: string[]
  subjectKeys?: string[]
  type: SubjectType
  title: string
}
function RendarSubjects({
  subjects = [],
  subjectKeys = [],
  type,
  title,
}: RendarSubjectsProps) {
  if (!subjects.length || !subjectKeys.length) return null

  const getLink = (id: string, type: SubjectType) => {
    switch (type) {
      case 'subject':
        return `/subjects/${id}`
      case 'person':
        return `/subjects/person:${id}`
      case 'place':
        return `/subjects/place:${id}`
      case 'time':
        return `/subjects/time:${id}`

      default:
        return ''
    }
  }

  return (
    <p className="text-xs md:text-sm">
      <strong className="uppercase">{title}:&nbsp;</strong>
      {subjectKeys.map((subjectKey, index) => (
        <>
          <Link
            to={getLink(subjectKey, type)}
            key={subjectKey}
            className="underline"
          >
            {subjects[index]}
          </Link>
          {subjectKeys.length - 1 !== index ? <>,&nbsp;&nbsp;</> : ''}
        </>
      ))}
    </p>
  )
}
