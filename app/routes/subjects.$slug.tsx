import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/node'
import { json, Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { SEOHandle } from '@nasa-gcn/remix-seo'
import { serverOnly$ } from 'vite-env-only/macros'
import { AdsterraHorizontalAdsBanner } from '~/components/ads/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import { Pagination } from '~/components/pagination'
import WorkCard from '~/components/work-card'
import { getWorksBySubject, popularSubjects } from '~/lib/api/subjects.server'
import { getMetaTitle } from '~/lib/utils'

// TODO: api has more functionalities like similer subjects

const PER_PAGE_LIMIT = 24

export async function loader({ request, params }: LoaderFunctionArgs) {
  const subjectSlug = `${params.slug}`

  const url = new URL(request.url)
  const offset = Number(url.searchParams.get('offset')) || 0
  const sort = url.searchParams.get('sort') ?? ''

  const headers: ResponseInit['headers'] = {
    'Cache-Control': 'public, max-age=86400, s-max-age=86400',
  }

  const subjectData = await getWorksBySubject({
    subject: subjectSlug,
    limit: PER_PAGE_LIMIT,
    offset,
    // sort,
  })
  const isPopular = Boolean(
    popularSubjects.find(({ id }) => id === subjectSlug),
  )

  // X-Robots-Tag header will prevent search result pages from indexing
  headers['X-Robots-Tag'] = 'noindex'

  return json(
    {
      isPopular,
      slug: subjectSlug,
      title: subjectData.title,
      totalWorks: subjectData.totalWorks,
      works: subjectData.works,
    },
    { headers },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async () => {
    return popularSubjects.map(subject => {
      return {
        route: `/subjects/${subject.id}`,
        priority: 0.4,
      }
    })
  }),
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `Top Books on ${data?.title} | Explore ${data?.title} Themes & Stories`
  const desc = `Discover captivating books about ${data?.title} on Tomeki. Explore timeless stories and the latest releases that dive deep into the theme of ${data?.title}.`

  const metaTags = [
    { title: getMetaTitle(title) },
    { name: 'description', content: desc },
  ]

  // robots meta tag will prevent search result pages from indexing
  if (!data?.isPopular) metaTags.push({ name: 'robots', content: 'noinex' })

  return metaTags
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
            Explore Books on
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
            {works.map(({ title, key, coverId, authors, workId }) => (
              <WorkCard
                key={key}
                title={title}
                coverId={coverId}
                authors={authors}
                workId={workId}
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
