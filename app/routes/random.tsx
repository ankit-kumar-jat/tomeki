import { SEOHandle } from '@nasa-gcn/remix-seo'

export const handle: SEOHandle = {
  getSitemapEntries: () => null, // this will exclude this route from sitemap
}

export default function Index() {
  return <div className="text-lg">Random</div>
}
