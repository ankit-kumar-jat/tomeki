import { type LoaderFunctionArgs } from '@remix-run/node'
import { SITE_NAME } from '~/config/site'
import { getBlogFeed } from '~/lib/api/blogs.server'
import { getFullURL } from '~/lib/utils'

export async function loader({ request }: LoaderFunctionArgs) {
  const { posts } = await getBlogFeed({ maxResults: 1000 })

  const blogUrl = getFullURL('/blogs')

  const rss = `
    <rss xmlns:blogChannel="${blogUrl}" version="2.0">
    <channel>
        <title>${SITE_NAME}</title>
        <link>${blogUrl}</link>
        <description>The Tomeki Blog - Your Gateway to Books, Reviews, and Recommendations</description>
        <language>en-us</language>
        <generator>${SITE_NAME}</generator>
        <ttl>900</ttl>
        ${posts
          .map(post =>
            `
            <item>
              <title>${cdata(replaceSpecial(post.title))}</title>
              <description>${cdata(
                replaceSpecial(
                  post.content.match(/<(\w+)>(.*?)<\/\1>/)?.[2] ??
                    'This post is... indescribable',
                ),
              )}</description>
              <pubDate>${
                post.publishedAt
                  ? new Date(post.publishedAt).toUTCString()
                  : new Date().toUTCString()
              }</pubDate>
              <link>${getFullURL(`/blogs${post.path}`)}</link>
              <guid>${getFullURL(`/blogs${post.path}`)}</guid>
            </item>
          `.trim(),
          )
          .join('\n')}
      </channel>
    </rss>
  `.trim()

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rss)),
      'Cache-Control': 'public, max-age=900, s-maxage=300',
    },
  })
}

function cdata(s: string) {
  return `<![CDATA[${s}]]>`
}

function replaceSpecial(s: string) {
  return s
    .replace(/&/g, '&#x26;')
    .replace(/</g, '&#x3C;')
    .replace(/>/g, '&#x3E;')
}
