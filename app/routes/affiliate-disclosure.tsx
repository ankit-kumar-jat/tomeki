import type { MetaFunction, HeadersFunction } from '@remix-run/node'
import { SITE_NAME, SITE_URL } from '~/config/site'
import { getMetaTitle } from '~/lib/utils'

export const headers: HeadersFunction = () => {
  // cache for 5 min
  return { 'Cache-Control': 'public, max-age=300, s-max-age=300' }
}

export const meta: MetaFunction = () => {
  return [{ title: getMetaTitle('Affiliate Disclosure') }]
}

export default function About() {
  return (
    <div className="container my-10">
      <div className="py-10 md:py-14">
        <h1 className="text-balance text-center text-3xl drop-shadow-md sm:text-5xl">
          Affiliate Disclosure
        </h1>
      </div>
      <div className="prose mx-auto dark:prose-invert">
        <p>
          Tomeki is a participant in the Amazon Services LLC Associates Program,
          an affiliate advertising program designed to provide a means for sites
          to earn advertising fees by advertising and linking to Amazon.com.
        </p>
        <p>
          This means that if you click on a link to Amazon on our site and make
          a purchase, we may receive a small commission at no extra cost to you.
          These commissions help support the running of this website, including
          content creation and development.
        </p>
        <p>
          Please note that all recommendations and opinions expressed on Tomeki
          are based on our independent research and analysis. We only promote
          products we believe add value to our users.
        </p>
        <p>Thank you for your support!</p>
      </div>
    </div>
  )
}
