import type { MetaFunction, HeadersFunction } from '@remix-run/cloudflare'
import { SITE_NAME, SITE_URL } from '~/config/site'
import { getMetaTitle } from '~/lib/utils'
import { NewsletterSubscriptionForm } from '~/routes/resources.convert-kit'

export const headers: HeadersFunction = () => {
  // cache for 5 min
  return { 'Cache-Control': 'public, max-age=3600, s-maxage=300' }
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
      <div className="prose prose-zinc mx-auto dark:prose-invert lg:prose-lg">
        <p>
          Welcome to Tomeki, your go-to destination for everything book-related!
          At Tomeki, we believe that books have the power to inspire, transform,
          and connect us, no matter where we are in the world.
        </p>
        <p>
          <strong>What We Offer</strong>
          <br />
          Whether you&rsquo;re a casual reader or a dedicated bookworm, Tomeki
          has something for you. We offer:
        </p>
        <ul>
          <li>
            <strong>Book Reviews:</strong> In-depth reviews of the latest
            releases, bestsellers, and timeless classics.
          </li>
          <li>
            <strong>Curated Recommendations:</strong> Handpicked book lists
            tailored to different genres, moods, and reading preferences.
          </li>
          <li>
            <strong>Literary Insights:</strong> Articles exploring themes,
            authors, and trends in the world of literature.
          </li>
          <li>
            <strong>Community:</strong> A space for readers to connect, share
            their thoughts, and discover their next great read.
          </li>
        </ul>
        <p>
          <strong>Our Mission</strong>
          <br />
          At Tomeki, we&rsquo;re passionate about helping readers discover books
          that speak to them. We&rsquo;re here to make it easier for you to
          explore new titles, find hidden gems, and expand your literary
          horizons.
        </p>
        <p>
          <strong>Why Tomeki?</strong>
          <br />
          We don&rsquo;t just focus on bestsellers&mdash;we dive into books from
          all genres and authors, bringing a fresh perspective on the world of
          literature. Our goal is to foster a community where readers can come
          together, share recommendations, and discuss books they love.
        </p>
        <p>
          <strong>Join Us</strong>
          <br />
          Sign up for our newsletter to stay updated on the latest reviews, book
          recommendations, and exclusive content. Let's journey through the
          world of books together!
        </p>
      </div>
      <NewsletterSubscriptionForm />
    </div>
  )
}
