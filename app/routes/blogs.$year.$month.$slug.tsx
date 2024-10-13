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
import { SITE_NAME } from '~/config/site'
import {
  getBlogPost,
  getBlogPosts,
  getBlogSitemapEntries,
} from '~/lib/api/blogs.server'
import { Button } from '~/components/ui/button'

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const apiKey = context.cloudflare.env.BLOGGER_API_KEY
  if (!apiKey) throw Error('API key not found!')

  const headers = { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' }

  const post = await getBlogPost({
    key: apiKey,
    path: `/${params.year}/${params.month}/${params.slug}`,
  })

  if (!post) {
    throw json({ errorMessage: 'Post not found,' }, { status: 404, headers })
  }

  const formattedPost = {
    id: post.id,
    title: post.title,
    coverImage: post.images?.[0]?.url ?? '',
    published: format(new Date(post.published), 'MMMM dd, yyyy'),
    content: post.content,
    labels: post.labels,
    description: post.content.match(/<(\w+)>(.*?)<\/\1>/)?.[2] ?? '',
    updated: post.updated,
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

  return [
    { title: `${data.post.title} | ${SITE_NAME} Blog` },
    { property: 'og:title', content: data.post.title },
    { name: 'description', content: data.post.description },
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
          <Link to="/blogs">Back to all blogs</Link>
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
                to={`/blogs?labels=${encodeURIComponent(label)}`}
                className="rounded-sm bg-muted px-2 py-1 text-sm font-medium text-muted-foreground no-underline focus-within:underline hover:underline"
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
