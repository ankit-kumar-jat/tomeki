import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import { searchWorks } from '~/lib/api.server/search'

export async function loader({ params }: LoaderFunctionArgs) {
  const { workId } = params

  const searchRes = await searchWorks({
    q: `key:"/works/${workId}"`,
    fields: ['title', 'key'],
  })
  if (!searchRes?.numFoundExact) {
    throw json({ errorMessage: 'Invalid bookId' }, { status: 404 })
  }

  return { work: searchRes.docs[0] }
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return data
    ? [
        { title: `book title by author | Novalla` },
        { name: 'description', content: 'book description' },
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
  return <div className="text-lg">{work.title}</div>
}
