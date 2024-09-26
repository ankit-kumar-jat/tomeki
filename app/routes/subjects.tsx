import { SEOHandle } from '@nasa-gcn/remix-seo'
import { AdsterraNativeAdsBanner } from '~/components/adsterra/native-ads-banner'
import { GoogleAdsBanner } from '~/components/google-ads/google-ads-banner'
import { GOOGLE_ADS_SLOTS } from '~/config/google-ads'

export const handle: SEOHandle = {
  getSitemapEntries: () => null, // this will exclude this route from sitemap
}

export default function Index() {
  return <div className="text-lg">Subjects</div>;
}
