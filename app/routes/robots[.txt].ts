import { generateRobotsTxt } from '@nasa-gcn/remix-seo'

export function loader() {
  return generateRobotsTxt(
    [{ type: 'sitemap', value: 'https://www.tomeki.site/sitemap.xml' }],
    { headers: { 'Cache-Control': `public, max-age=${60 * 5}` } },
  )
}
