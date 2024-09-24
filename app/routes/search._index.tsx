import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import SearchForm from '~/components/search-form'
import { searchWorks } from '~/lib/api.server/search'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (!q) {
    return {
      numFound: 0,
      foundExact: false,
      works: [],
    }
  }

  const searchRes = await searchWorks({ q, fields: ['title', 'key'] })

  return {
    numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
    foundExact: searchRes?.numFoundExact ?? false,
    works: searchRes?.docs?.length ? searchRes.docs : [],
  }
}

export default function Index() {
  const { numFound, foundExact, works } = useLoaderData<typeof loader>()

  return (
    <>
      <SearchForm />
      <div className="mt-4 space-y-4 lg:mt-6">
        <div className="flex flex-nowrap justify-between gap-4 text-xs md:text-sm">
          <p>{numFound} Results</p>
          <div className="whitespace-nowrap">SortBy: Relavance</div>
        </div>
        <div>
          {works.map(work => (
            <div key={work.key}>
              <p>{work.title}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
