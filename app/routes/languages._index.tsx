import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/cloudflare'
import { json, Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { AdsterraHorizontalAdsBanner } from '~/components/ads/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import { Button } from '~/components/ui/button'
import { getLanguages } from '~/lib/api/languages.server'
import { getMetaTitle } from '~/lib/utils'

const BASIC_PAGE_LIMIT = 36

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const showAll = Boolean(url.searchParams.get('all'))

  const headers = {
    'Cache-Control': 'public, max-age=604800, s-max-age=604800',
  }

  const languages = await getLanguages({
    limit: showAll ? undefined : BASIC_PAGE_LIMIT,
  })

  return json({ languages }, { headers })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const meta: MetaFunction = () => {
  return [
    { title: getMetaTitle('Browse Books by Language | Discover Global Reads') },
    {
      name: 'description',
      content:
        'Explore a wide selection of books in various languages on Tomeki. Discover captivating stories and literature from around the world, available in your preferred language.',
    },
  ]
}

export default function Index() {
  const { languages } = useLoaderData<typeof loader>()
  const [searchParams, setSearchParams] = useSearchParams()
  const showAll = Boolean(searchParams.get('all'))

  const handleViewMore = () => {
    setSearchParams({ all: 'y' }, { preventScrollReset: true })
  }

  return (
    <div className="container my-10">
      <div className="py-10 md:py-14">
        <h1 className="text-balance text-center text-3xl drop-shadow-md sm:text-5xl">
          Browse Books by Language
        </h1>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {languages.map(({ title, langId, booksCount }) => (
            <Link
              to={`/languages/${langId}`}
              key={langId}
              className="flex flex-col justify-center rounded-md border px-4 py-6"
            >
              <span className="line-clamp-2 text-lg font-medium md:text-xl">
                {title}
              </span>
              <span>{booksCount.toLocaleString('en-US')} Books</span>
            </Link>
          ))}
        </div>
        {!showAll && (
          <div className="mt-6 flex justify-center">
            <Button className="w-48" onClick={handleViewMore}>
              View More
            </Button>
          </div>
        )}
      </div>
      <div>
        <AdsterraHorizontalAdsBanner />
        <AdsterraNativeAdsBanner />
      </div>
      <div className="my-36"></div>
    </div>
  )
}
