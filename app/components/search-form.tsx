import { Form, useSearchParams } from '@remix-run/react'
import { SearchIcon, XIcon } from 'lucide-react'

function SearchForm({
  searchInputName = 'q',
  placeholder = 'Type here to search',
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchValue = searchParams.get(searchInputName) || ''

  const clearSearchInput = () => {
    setSearchParams(
      prev => {
        prev.delete(searchInputName)
        return prev
      },
      { preventScrollReset: true },
    )
  }
  return (
    <Form
      action=""
      method="get"
      className="relative flex rounded-full border"
      autoComplete="off"
    >
      <input
        name={searchInputName}
        className="peer h-12 w-full rounded-s-full bg-transparent pl-6 outline-none ring-primary placeholder:text-foreground/50 placeholder:drop-shadow-sm focus-within:ring-2"
        placeholder={placeholder}
        defaultValue={searchValue}
        autoComplete="off"
      />
      <button
        className="absolute right-14 top-0 px-2 py-3 outline-none ring-primary focus-within:ring-2 peer-placeholder-shown:invisible"
        onClick={clearSearchInput}
        type="reset"
      >
        <span className="sr-only">Clear</span>
        <XIcon />
      </button>
      <button className="rounded-e-full border-l p-3 pr-4 outline-none ring-primary focus-within:ring-2">
        <span className="sr-only">Search</span>
        <SearchIcon />
      </button>
    </Form>
  )
}

export default SearchForm
