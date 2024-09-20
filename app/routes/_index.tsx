import type { MetaFunction } from '@remix-run/node'
import Hero from '~/components/hero'

export const meta: MetaFunction = () => {
  return [
    { title: 'Novalla - Search Millions of Books Instantly' },
    {
      name: 'description',
      content:
        "Explore Novalla's vast collection of books across all genres. Search, discover, and dive into millions of books with ease. Find your next favorite read on Novalla!",
    },
  ]
}

export default function Index() {
  return (
    <>
      <Hero />
    </>
  )
}
