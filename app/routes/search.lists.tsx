import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import SearchForm from '~/components/search-form'
import { searchLists } from '~/lib/api.server/search'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (!q) {
    return {
      numFound: 0,
      foundExact: false,
      lists: [],
    }
  }

  const searchRes = await searchLists({ q })

  return {
    numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
    foundExact: searchRes?.numFoundExact ?? false,
    lists: searchRes?.docs?.length ? searchRes.docs : [],
  }
}

export default function Index() {
  const { numFound, foundExact, lists } = useLoaderData<typeof loader>()
  return (
    <>
      <SearchForm placeholder="Search by list name" />
      <div className="mt-4 space-y-4 lg:mt-6">
        <div>
          {lists.map(list => (
            <div key={list.url}>
              <p>{list.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
