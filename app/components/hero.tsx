import { Form } from '@remix-run/react'
import { SearchIcon } from 'lucide-react'

function Hero() {
  return (
    <div className="relative py-14 text-center md:py-20 lg:py-24">
      <h1 className="mx-auto max-w-5xl text-balance text-3xl drop-shadow-md sm:text-5xl lg:text-6xl">
        Discover Millions of Books at Your Fingertips
      </h1>
      <p className="mx-auto mt-6 max-w-screen-sm text-balance text-sm drop-shadow-sm md:text-base lg:max-w-screen-md">
        Explore a vast library of books across genres and authors. With Tomeki,
        finding your next great read is just a search away. Dive into a world of
        literature, from timeless classics to contemporary gems.
      </p>

      <Form
        action="/search"
        method="get"
        className="mx-auto mt-6 flex max-w-lg rounded-full border border-foreground/30"
      >
        <input
          name="q"
          className="h-12 w-full rounded-s-full bg-transparent pl-6 placeholder:text-foreground/50 placeholder:drop-shadow-sm"
          placeholder="Search Book title, author..."
        />
        <button className="rounded-e-full border-l border-l-foreground/30 p-3 pr-4">
          <span className="sr-only">Search</span>
          <SearchIcon />
        </button>
      </Form>

      <DynamicBlurBackground />
    </div>
  )
}

const colors = [
  '#c8553d',
  '#F28F3B',
  '#588B8B',
  '#ACE894',
  '#433633',
  '#b91c1c',
  '#b45309',
  '#0e7490',
  '#a21caf',
  '#be123c',
]

function DynamicBlurBackground() {
  const radomColor = colors[Math.floor(Math.random() * colors.length)]
  return (
    <div className="absolute inset-0 -z-10">
      <div
        className="h-full w-full opacity-50 blur-[100px]"
        style={{ backgroundColor: radomColor }}
      ></div>
    </div>
  )
}

export default Hero
