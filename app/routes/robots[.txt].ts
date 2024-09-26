import { generateRobotsTxt } from '@nasa-gcn/remix-seo'

export function loader() {
  return generateRobotsTxt(
    [{ type: 'sitemap', value: 'https://novalla.pages.dev/sitemap.xml' }],
    { headers: { 'Cache-Control': `public, max-age=${60 * 5}` } },
  )
}
