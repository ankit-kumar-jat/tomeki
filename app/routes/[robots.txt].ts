import { generateRobotsTxt } from '@nasa-gcn/remix-seo'
import { SITE_URL } from '~/config/site'

export function loader() {
  return generateRobotsTxt(
    [
      { type: 'allow', value: '/ads.txt' },
      { type: 'disallow', value: '/books' },
      { type: 'disallow', value: '/subjects' },
      { type: 'disallow', value: '/authors' },
      { type: 'disallow', value: '/languages' },
      { type: 'disallow', value: '/search?q=*' },
      { type: 'sitemap', value: `${SITE_URL}/sitemap.xml` },
    ],
    { headers: { 'Cache-Control': `public, max-age=${60 * 5}` } },
  )
}
