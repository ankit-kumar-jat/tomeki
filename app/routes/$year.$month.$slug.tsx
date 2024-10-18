import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/cloudflare'
import { serverOnly$ } from 'vite-env-only/macros'
import { json, Link, useLoaderData } from '@remix-run/react'
import { useMemo } from 'react'
import { format } from 'date-fns'
import { SEOHandle } from '@nasa-gcn/remix-seo'
import { NewsletterSubscriptionForm } from '~/routes/resources.convert-kit'
import { SITE_NAME, SITE_URL } from '~/config/site'
import { getBlogPost, getBlogSitemapEntries } from '~/lib/api/blogs.server'
import { getFullURL, getMetaTitle } from '~/lib/utils'
import { EXTRACT_COVER_IMG, EXTRACT_DESC } from '~/config/regex'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const apiKey = context.cloudflare.env.BLOGGER_API_KEY
  if (!apiKey) throw Error('API key not found!')

  const headers = { 'Cache-Control': 'public, max-age=3600, s-maxage=300' }

  const path = `/${params.year}/${params.month}/${params.slug}`

  const post = await getBlogPost({ key: apiKey, path })

  if (!post) {
    throw json({ errorMessage: 'Post not found,' }, { status: 404, headers })
  }

  const formattedPost = {
    id: post.id,
    title: post.title,
    coverImage:
      post.images?.[0]?.url ?? post.content.match(EXTRACT_COVER_IMG)?.[1] ?? '',
    published: format(new Date(post.published), 'MMMM dd, yyyy'),
    content: post.content,
    labels: post.labels,
    description: post.content.match(EXTRACT_DESC)?.[1]?.trim() ?? '',
    updatedAt: post.updated,
    publishedAt: post.published,
    path,
  }

  return json({ post: formattedPost }, { headers })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async () => {
    const entries = await getBlogSitemapEntries()
    return entries
  }),
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Not Found' },
      {
        name: 'description',
        content: 'You landed on a page that does not exists.',
      },
    ]
  }

  const {
    title,
    description,
    coverImage,
    labels,
    publishedAt,
    updatedAt,
    path,
  } = data.post

  return [
    { title: getMetaTitle(title) },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:image', content: coverImage },
    { property: 'og:description', content: description },
    { tagName: 'link', rel: 'canonical', href: getFullURL(path) },
    {
      'script:ld+json': {
        '@context': 'https://schema.org/',
        '@type': 'BlogPosting',
        '@id': getFullURL(path),
        headline: title,
        name: title,
        description,
        image: coverImage,
        inLanguage: 'en-US',
        keywords: labels,
        datePublished: publishedAt,
        dateModified: updatedAt,
        url: getFullURL(path),
        author: { '@type': 'Person', name: SITE_NAME },
        isPartOf: {
          '@type': 'Blog',
          '@id': getFullURL('/explore'),
          name: SITE_NAME,
          publisher: {
            '@type': 'Organization',
            '@id': SITE_URL,
            name: SITE_NAME,
          },
        },
        publisher: {
          '@type': 'Organization',
          '@id': SITE_URL,
          name: SITE_NAME,
          logo: getFullURL('/logo.png'),
        },
      },
    },
  ]
}

function readTime(str: string) {
  const words = str.match(/(\w+)/g)?.length ?? 300
  const readMins = Math.trunc(words / 300)
  return readMins
}

export default function BlogPostDetails() {
  const { post } = useLoaderData<typeof loader>()

  const readMins = useMemo(() => {
    const time = readTime(post.content)
    return time < 1 ? 1 : time
  }, [post.content])

  return (
    <div className="container my-10">
      <div className="prose prose-zinc mx-auto dark:prose-invert lg:prose-lg">
        <div className="py-8 md:py-10">
          <Link to="/explore" prefetch="intent">
            Back to all posts
          </Link>
        </div>
        <div className="mb-10 space-y-4 md:mb-14">
          <h1>{post.title}</h1>
          <p>
            {post.published} - {readMins} Min Read
          </p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="my-10">
          <p className="flex flex-wrap items-center gap-1">
            {post.labels.map(label => (
              <Link
                key={label}
                prefetch="intent"
                to={`/explore?category=${encodeURIComponent(label)}`}
                className="rounded-sm bg-muted px-2 py-1 text-sm font-medium text-muted-foreground no-underline outline-none ring-foreground hover:underline focus-visible:underline focus-visible:ring-2"
              >
                {label}
              </Link>
            ))}
          </p>
        </div>
      </div>
      <div>
        <NewsletterSubscriptionForm />
      </div>
    </div>
  )
}
