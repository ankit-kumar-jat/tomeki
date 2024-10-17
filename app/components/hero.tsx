import { Form } from '@remix-run/react'
import { SearchIcon } from 'lucide-react'
import { DynamicBlurBackground } from '~/components/dynamic-blur-background'

function Hero() {
  return (
    <div className="py-14 text-center md:py-20 lg:py-24">
      <div className="relative mx-auto max-w-4xl">
        <h1 className="text-balance text-3xl drop-shadow-md sm:text-5xl lg:text-6xl">
          Your Guide to the Best Books
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-sm drop-shadow-sm md:text-base lg:max-w-xl">
          Dive into reviews, recommendations, and everything book-related.
          Whether you're a casual reader or a bibliophile, Tomeki has something
          for you.
        </p>

        <Form
          action="/search"
          method="get"
          className="mx-auto mt-8 flex max-w-lg rounded-full border border-foreground/30"
        >
          <input
            name="q"
            className="h-12 w-full rounded-s-full bg-transparent pl-6 outline-none ring-primary placeholder:text-foreground/50 placeholder:drop-shadow-sm focus-within:ring-2"
            placeholder="Type here to search"
          />
          <button className="rounded-e-full border-l border-l-foreground/30 p-3 pr-4 outline-none ring-primary focus-visible:ring-2">
            <span className="sr-only">Search</span>
            <SearchIcon />
          </button>
        </Form>
        <DynamicBlurBackground />
      </div>
    </div>
  )
}

export default Hero
