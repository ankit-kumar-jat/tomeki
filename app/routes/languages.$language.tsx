import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/node'
import { json, useLoaderData, useSearchParams } from '@remix-run/react'
import { AdsterraHorizontalAdsBanner } from '~/components/ads/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import { Pagination } from '~/components/pagination'
import WorkCard from '~/components/work-card'
import { searchWorks } from '~/lib/api.server/search'
import { getMetaTitle } from '~/lib/utils'

const PER_PAGE_LIMIT = 24

export async function loader({ request, params }: LoaderFunctionArgs) {
  const languageSlug = `${params.language}`

  const url = new URL(request.url)
  const offset = Number(url.searchParams.get('offset')) || 0

  const headers = { 'Cache-Control': 'public, max-age=86400, s-max-age=86400' }

  const langaugeData = await searchWorks({
    q: `language:${languageSlug}`,
    limit: PER_PAGE_LIMIT,
    offset,
    fields: ['title', 'key', 'cover_i', 'author_name'],
  })

  let title

  try {
    title =
      new Intl.DisplayNames(['en'], { type: 'language' }).of(languageSlug) ??
      languageSlug
  } catch {
    throw json(
      { errorMessage: 'Invalid language code' },
      { status: 404, headers },
    )
  }

  return json(
    {
      slug: languageSlug,
      title: title,
      totalWorks: langaugeData?.numFound ?? 0,
      works: langaugeData?.docs ?? [],
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.title} Books | Discover Literature & Stories in ${data?.title} | Tomeki`
  const desc = `Explore a rich collection of ${data?.title} books on Tomeki. Dive into captivating stories, novels, and literature from ${data?.title}-speaking authors and cultures.`
  return [
    { title: getMetaTitle(title) },
    { name: 'description', content: desc },
  ]
}

export default function SubjectWorks() {
  const { slug, title, totalWorks, works } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const offset = Number(searchParams.get('offset')) || 0

  const pageStart = offset + 1
  const pageEnd = offset + PER_PAGE_LIMIT
  return (
    <div className="container my-10">
      <div className="my-10 md:my-14">
        <h1 className="text-balance text-center text-3xl capitalize drop-shadow-md sm:text-5xl">
          <span className="text-xs uppercase tracking-wide text-muted-foreground sm:text-sm">
            Browse Books in
          </span>
          <br />
          {title}
        </h1>
      </div>
      <div className="space-y-4">
        <div className="flex flex-nowrap justify-between gap-4 font-medium md:text-lg">
          <p>
            {pageStart}-{pageEnd > totalWorks ? totalWorks : pageEnd} of{' '}
            {totalWorks.toLocaleString('en-US')} Books
          </p>
          {/* <div className="whitespace-nowrap">
                    <SortDropdown />
                  </div> */}
        </div>
        <div className="min-h-60 space-y-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {works.map(({ title, key, cover_i, author_name }) => (
              <WorkCard
                key={key}
                title={title}
                coverId={cover_i}
                authors={
                  author_name?.map(author => ({ name: author })) ?? { name: '' }
                }
                workId={key.split('/').pop() ?? ''}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Pagination totalItems={totalWorks} rowsPerPage={PER_PAGE_LIMIT} />
          </div>
        </div>
      </div>
      <div>
        <AdsterraHorizontalAdsBanner />
        <AdsterraNativeAdsBanner />
      </div>
    </div>
  )
}
