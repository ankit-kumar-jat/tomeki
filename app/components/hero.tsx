import { Form } from '@remix-run/react'
import { SearchIcon } from 'lucide-react'

function Hero() {
  return (
    <div className="py-14 text-center md:py-20 lg:py-24">
      <h1 className="mx-auto max-w-5xl text-balance text-3xl sm:text-5xl lg:text-6xl">
        Discover Millions of Books at Your Fingertips
      </h1>
      <p className="mx-auto mt-6 max-w-screen-sm text-balance text-sm md:text-base lg:max-w-screen-md">
        Explore a vast library of books across genres and authors. With Tomeki,
        finding your next great read is just a search away. Dive into a world of
        literature, from timeless classics to contemporary gems.
      </p>

      <Form
        action="/search"
        method="get"
        className="mx-auto mt-6 flex max-w-lg rounded-full border"
      >
        <input
          name="q"
          className="h-12 w-full rounded-s-full pl-6"
          placeholder="Search Book title, author..."
        />
        <button className="rounded-e-full border-l p-3 pr-4">
          <span className="sr-only">Search</span>
          <SearchIcon />
        </button>
      </Form>
    </div>
  )
}

export default Hero
