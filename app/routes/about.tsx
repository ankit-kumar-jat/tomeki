import type { MetaFunction, HeadersFunction } from '@remix-run/node'
import { SITE_NAME, SITE_URL } from '~/config/site'
import { getMetaTitle } from '~/lib/utils'

export const headers: HeadersFunction = () => {
  // cache for 5 min
  return { 'Cache-Control': 'public, max-age=300, s-max-age=300' }
}

export const meta: MetaFunction = () => {
  return [{ title: getMetaTitle('About Us') }]
}

export default function About() {
  return (
    <div className="container my-10">
      <div className="py-10 md:py-14">
        <h1 className="text-balance text-center text-3xl drop-shadow-md sm:text-5xl">
          About
        </h1>
      </div>
      <div className="prose mx-auto">
        <p>
          Welcome to {SITE_NAME}, your go-to destination for discovering
          millions of books from around the world. Whether you're a casual
          reader, a literary enthusiast, or someone on the hunt for a specific
          title, {SITE_NAME} makes it easy to explore, search, and enjoy the
          vast world of books.
        </p>
        <p>
          Our mission is to connect readers with the stories they love, making
          literature more accessible and enjoyable for everyone. We believe in
          the power of books to inspire, educate, and entertain, and we strive
          to create an intuitive platform that brings this experience to your
          fingertips.
        </p>
        <p>
          At {SITE_NAME}, we value diversity, featuring books across genres,
          languages, and cultures. Whether you're diving into fiction, exploring
          history, learning from self-help, or studying science, you'll find the
          perfect book for every mood and moment.
        </p>
        pWe are passionate about books and aim to build a community that
        celebrates the joy of reading. Join us on this literary journey, and
        discover your next favorite book on {SITE_NAME}.
      </div>
    </div>
  )
}
