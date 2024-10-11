import { SEOHandle } from '@nasa-gcn/remix-seo'
import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/cloudflare'
import { json, Link, useLoaderData } from '@remix-run/react'
import Hero from '~/components/hero'
import Section from '~/components/section'

export async function loader({ request }: LoaderFunctionArgs) {
  return json(
    {},
    { headers: { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' } },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const handle: SEOHandle = {
  getSitemapEntries: () => [
    {
      route: '/',
      changefreq: 'daily',
      priority: 1.0,
    },
  ],
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Tomeki Book Blogs - Search Millions of Books Instantly' },
    {
      name: 'description',
      content:
        "Explore Tomeki's vast collection of books across all genres. Search, discover, and dive into millions of books with ease. Find your next favorite read on Tomeki!",
    },
  ]
}

export default function Index() {
  const {} = useLoaderData<typeof loader>()

  return (
    <div className="container">
      <Hero />

      <Section className="my-10 lg:mb-14" title="Trending Today">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          Trending Today
        </div>
      </Section>

      <Section className="my-10 lg:mb-14" title="Browse By Language">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          Browse By Language
          {/* {languages.map(({ title, langId, booksCount }) => (
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
          ))} */}
        </div>
      </Section>
    </div>
  )
}
