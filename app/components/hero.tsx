import { Form } from '@remix-run/react'
import { SearchIcon } from 'lucide-react'
import { DynamicBlurBackground } from '~/components/dynamic-blur-background'

function Hero() {
  return (
    <div className="relative py-14 text-center md:py-20 lg:py-24">
      <h1 className="mx-auto max-w-5xl text-balance text-3xl drop-shadow-md sm:text-5xl lg:text-6xl">
        Discover Millions of Books at Your Fingertips
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-balance text-sm ring-primary drop-shadow-sm focus-within:ring-2 md:text-base">
        Explore a vast library of books across genres and authors. With Tomeki,
        finding your next great read is just a search away. Dive into a world of
        literature, from timeless classics to contemporary gems.
      </p>

      <Form
        action="/search"
        method="get"
        className="mx-auto mt-6 flex max-w-lg rounded-full border border-foreground/30 outline-none ring-primary focus-within:ring-2"
      >
        <input
          name="q"
          className="h-12 w-full rounded-s-full bg-transparent pl-6 placeholder:text-foreground/50 placeholder:drop-shadow-sm"
          placeholder="Search Book title, author..."
        />
        <button className="rounded-e-full border-l border-l-foreground/30 p-3 pr-4 outline-none">
          <span className="sr-only">Search</span>
          <SearchIcon />
        </button>
      </Form>

      <DynamicBlurBackground />
    </div>
  )
}

export default Hero
