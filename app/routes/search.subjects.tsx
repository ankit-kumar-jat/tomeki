import type { LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import SearchForm from '~/components/search-form'
import { searchSubjects } from '~/lib/api.server/search'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')

  if (!q) {
    return {
      numFound: 0,
      foundExact: false,
      subjects: [],
    }
  }

  const searchRes = await searchSubjects({ q })

  return {
    numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
    foundExact: searchRes?.numFoundExact ?? false,
    subjects: searchRes?.docs?.length ? searchRes.docs : [],
  }
}

export default function Index() {
  const { numFound, foundExact, subjects } = useLoaderData<typeof loader>()
  return (
    <>
      <SearchForm placeholder="Search by subject name" />
      <div className="mt-4 space-y-4 lg:mt-6">
        <div className="flex flex-nowrap justify-between gap-4 text-xs md:text-sm">
          <p>{numFound} Results</p>
        </div>
        <div>
          {subjects.map(subject => (
            <div key={subject.key}>
              <p>{subject.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
