import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/node'
import { json, Link, useLoaderData } from '@remix-run/react'
import { popularSubjects } from '~/lib/api.server/subjects'
import { AdsterraNativeAdsBanner } from '~/components/ads/adsterra/native-ads-banner'
import { getMetaTitle } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const headers = { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' }

  return json({ subjects: popularSubjects }, { headers })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const meta: MetaFunction = () => {
  return [
    { title: getMetaTitle('Explore Popular Book Subjects') },
    {
      name: 'description',
      content:
        'Discover a vast collection of books categorized by popular subjects. Dive into fiction, history, science, and more on Tomeki, your gateway to endless reading adventures.',
    },
  ]
}

export default function Index() {
  const { subjects } = useLoaderData<typeof loader>()
  return (
    <div className="container my-10">
      <div className="py-10 md:py-14">
        <h1 className="text-balance text-center text-3xl drop-shadow-md sm:text-5xl">
          Popular Subjects
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {subjects.map(({ title, id }) => (
          <Link
            to={`/subjects/${id}`}
            key={id}
            className="flex items-center rounded-md border px-4 py-6"
          >
            <span className="text-lg font-medium md:text-xl">{title}</span>
          </Link>
        ))}
      </div>
      <AdsterraNativeAdsBanner />
      <div className="my-36"></div>
    </div>
  )
}
