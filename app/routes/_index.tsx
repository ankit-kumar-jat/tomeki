import { SEOHandle } from '@nasa-gcn/remix-seo'
import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/cloudflare'
import { json, Link, useLoaderData } from '@remix-run/react'
import Hero from '~/components/hero'
import { PostCard } from '~/components/post-card'
import Section from '~/components/section'
import { getBlogLabels, getBlogPosts } from '~/lib/api/blogs.server'
import { NewsletterSubscriptionForm } from '~/routes/resources.convert-kit'

export async function loader({ request, context }: LoaderFunctionArgs) {
  const apiKey = context.cloudflare.env.BLOGGER_API_KEY
  if (!apiKey) throw Error('API key not found!')

  const [latest, recommended, bookReviews, authorSpotlights, labels] =
    await Promise.all([
      getBlogPosts({
        key: apiKey,
        maxResults: 3,
      }),
      getBlogPosts({
        key: apiKey,
        maxResults: 3,
        labels: 'Book List,Must-Read Books',
      }),
      getBlogPosts({
        key: apiKey,
        maxResults: 3,
        labels: 'Reviews',
      }),
      getBlogPosts({
        key: apiKey,
        maxResults: 3,
        labels: 'Author Spotlights',
      }),
      getBlogLabels(),
    ])
  return json(
    {
      latest: latest.posts,
      recommended: recommended.posts,
      bookReviews: bookReviews.posts,
      authorSpotlights: authorSpotlights.posts,
      labels,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=300' } },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const handle: SEOHandle = {
  getSitemapEntries: () => [
    {
      route: '/',
      changefreq: 'daily',
      priority: 1.0,
    },
  ],
}

export const meta: MetaFunction = () => {
  return [
    {
      title:
        'Tomeki Book Blog - Your Gateway to Books, Reviews, and Recommendations',
    },
    {
      name: 'description',
      content:
        'Discover engaging book reviews, curated recommendations, and deep dives into the world of literature on Tomeki. Find your next great read.',
    },
  ]
}

export default function Index() {
  const { latest, recommended, bookReviews, authorSpotlights, labels } =
    useLoaderData<typeof loader>()

  return (
    <div className="container">
      <Hero />

      <div className="my-10 space-y-16 lg:mb-14 lg:space-y-24">
        {latest.length ? (
          <Section title="Latest Articles">
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {latest.map(post => (
                <PostCard
                  key={post.id}
                  coverImage={post.coverImage}
                  title={post.title}
                  publishedAt={post.published}
                  postPath={post.path}
                  labels={post.labels}
                />
              ))}
            </div>
            <div className="my-6 text-center">
              <Link
                to="/blogs"
                className="rounded-full px-3 py-1 font-medium underline outline-none ring-foreground focus-visible:ring-2"
              >
                View More
              </Link>
            </div>
          </Section>
        ) : null}
        {recommended.length ? (
          <Section title="Book Recommendations">
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {recommended.map(post => (
                <PostCard
                  key={post.id}
                  coverImage={post.coverImage}
                  title={post.title}
                  publishedAt={post.published}
                  postPath={post.path}
                  labels={post.labels}
                />
              ))}
            </div>
            <div className="my-6 text-center">
              <Link
                to="/blogs?labels=List"
                className="rounded-full px-3 py-1 font-medium underline outline-none ring-foreground focus-visible:ring-2"
              >
                View More
              </Link>
            </div>
          </Section>
        ) : null}
        {bookReviews.length ? (
          <Section title="Latest Reviews">
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {bookReviews.map(post => (
                <PostCard
                  key={post.id}
                  coverImage={post.coverImage}
                  title={post.title}
                  publishedAt={post.published}
                  postPath={post.path}
                  labels={post.labels}
                />
              ))}
            </div>
            <div className="my-6 text-center">
              <Link
                to="/blogs?labels=Review"
                className="rounded-full px-3 py-1 font-medium underline outline-none ring-foreground focus-visible:ring-2"
              >
                View More
              </Link>
            </div>
          </Section>
        ) : null}

        <Section title="Browse By Label">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {labels.map(label => (
              <Link
                to={`/blogs?labels=${encodeURIComponent(label)}`}
                key={label}
                className="flex flex-col justify-center rounded-xl border px-4 py-6 outline-none ring-foreground focus-visible:ring-2"
              >
                <span className="line-clamp-2 text-lg font-medium md:text-xl">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </Section>

        {authorSpotlights.length ? (
          <Section title="Author Spotlights">
            <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {authorSpotlights.map(post => (
                <PostCard
                  key={post.id}
                  coverImage={post.coverImage}
                  title={post.title}
                  publishedAt={post.published}
                  postPath={post.path}
                  labels={post.labels}
                />
              ))}
            </div>
            <div className="my-6 text-center">
              <Link
                to="/blogs?labels=Author+Spotlight"
                className="rounded-full px-3 py-1 font-medium underline outline-none ring-foreground focus-visible:ring-2"
              >
                View More
              </Link>
            </div>
          </Section>
        ) : null}

        <div>
          <NewsletterSubscriptionForm />
          <p className="mx-auto max-w-lg text-center">
            Tomeki is a space for book lovers. Here, you’ll find thoughtful
            reviews, curated recommendations, and articles that celebrate the
            world of literature. Whether you’re looking for your next great read
            or exploring new genres, we’ve got you covered.
          </p>
        </div>
      </div>
    </div>
  )
}
