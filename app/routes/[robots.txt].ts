import { generateRobotsTxt } from '@nasa-gcn/remix-seo'
import { SITE_URL } from '~/config/site'

export function loader() {
  return generateRobotsTxt(
    [{ type: 'sitemap', value: `${SITE_URL}/sitemap.xml` }],
    { headers: { 'Cache-Control': `public, max-age=${60 * 5}` } },
  )
}
