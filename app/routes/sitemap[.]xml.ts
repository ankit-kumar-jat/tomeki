import type { LoaderFunctionArgs } from '@remix-run/node'
import { generateSitemap } from '@nasa-gcn/remix-seo'
// @ts-ignore
import { routes } from 'virtual:remix/server-build'

export function loader({ request, context }: LoaderFunctionArgs) {
  return generateSitemap(request, routes, {
    siteUrl: 'https://novalla.pages.dev',
    headers: { 'Cache-Control': `public, max-age=${60 * 5}` },
  })
}
