import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { generateSitemap } from '@nasa-gcn/remix-seo'
// @ts-ignore
import { routes } from 'virtual:remix/server-build'
import { SITE_URL } from '~/config/site'

export function loader({ request, context }: LoaderFunctionArgs) {
  return generateSitemap(request, routes, {
    siteUrl: SITE_URL,
    headers: { 'Cache-Control': `public, max-age=${60 * 5}` },
  })
}
