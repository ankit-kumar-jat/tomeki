import type {
  LoaderFunctionArgs,
  HeadersFunction,
  MetaFunction,
} from '@remix-run/node'
import type { ShouldRevalidateFunction } from '@remix-run/react'
import { json, NavLink, Outlet, useLoaderData } from '@remix-run/react'
import { searchAuthors } from '~/lib/api/search.server'
import { cn, getAuthorImage, getFullURL, getMetaTitle } from '~/lib/utils'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authorId = `${params.authorId}`

  const headers: ResponseInit['headers'] = {
    'Cache-Control': 'public, max-age=86400, s-max-age=86400', // 24*60*60 = 86400 = 24 hours
  }

  const searchRes = await searchAuthors({
    q: `key:/authors/${authorId}`,
    limit: 1,
    fields: [
      'name',
      'key',
      'top_subjects',
      'work_count',
      'top_work',
      'birth_date',
      'death_date',
    ],
  })

  if (!searchRes?.numFoundExact || !searchRes?.docs?.length) {
    throw json({ errorMessage: 'Invalid authorId' }, { status: 404, headers })
  }

  return json({ author: searchRes.docs[0], authorId }, { headers })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
}) => {
  if (currentParams.authorId !== nextParams.authorId) {
    return true // only revalidate if author changed
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
  const title = `${data.author.name}`
  const desc = ''

  return [
    { title: getMetaTitle(title) },
    { property: 'og:title', content: title },
    { name: 'description', content: desc },
    {
      tagName: 'link',
      rel: 'canonical',
      href: getFullURL(`/authors/${data.authorId}`),
    },
  ]
}

const navLinks = [
  { to: '', title: 'Details', end: true },
  { to: 'books', title: 'Books' },
]

export default function AuthorDetails() {
  const { author } = useLoaderData<typeof loader>()

  const coverImageUrl = author.key
    ? getAuthorImage({ type: 'olid', id: author.key })
    : undefined

  return (
    <div className="mb-10">
      <div className="container relative mb-10 pt-20 md:mb-14 md:pt-32 lg:pt-48">
        {/* <AdeptiveBlurBackground /> */}
        <div className="flex gap-6 md:gap-10">
          <div className="flex-shrink-0">
            <CoverImage title={author.name} coverImageUrl={coverImageUrl} />
          </div>
          <div className="flex flex-col gap-2 md:gap-4">
            <div className="mb-2 sm:mb-4">
              <h1 className="line-clamp-2 text-lg font-extrabold tracking-wide drop-shadow-md sm:text-xl md:text-3xl lg:text-4xl">
                {author.name}
              </h1>
              <p className="mt-2 line-clamp-2 text-sm italic opacity-70 drop-shadow-sm sm:text-base">
                {author.birth_date} - {author.death_date}
              </p>
            </div>
            <div className="mt-2 hidden md:block">
              <WorksInfo
                workCount={author.work_count}
                topWork={author.top_work}
                topSubjects={author.top_subjects}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container my-8 md:hidden">
        <WorksInfo
          workCount={author.work_count}
          topWork={author.top_work}
          topSubjects={author.top_subjects}
        />
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

interface CoverImageProps {
  coverImageUrl?: string
  title: string
}

function CoverImage({ coverImageUrl = '', title }: CoverImageProps) {
  return (
    <>
      {coverImageUrl ? (
        <img
          className="aspect-[3/4] h-auto w-24 md:w-48"
          width={192}
          height={288}
          src={coverImageUrl}
          alt={`Cover of ${title}`}
        />
      ) : (
        <div className="aspect-[3/4] w-24 bg-muted p-3 opacity-50 md:w-48">
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

interface WorksInfoProps {
  workCount: number
  topSubjects?: string[]
  topWork?: string
}

function WorksInfo({ workCount, topSubjects, topWork }: WorksInfoProps) {
  return (
    <p className="max-w-xl text-sm drop-shadow-md md:text-base">
      <span className="font-medium">{workCount} Books </span>
      {topSubjects ? (
        <span className="text-foreground/80">
          about {topSubjects.join(', ')}
        </span>
      ) : null}
      {topWork ? (
        <>
          <span className="text-foreground/80"> including the book </span>
          <span className="font-medium">"{topWork}"</span>
        </>
      ) : null}
    </p>
  )
}
