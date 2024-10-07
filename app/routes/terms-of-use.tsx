import type { MetaFunction, HeadersFunction } from '@remix-run/cloudflare'
import { SITE_NAME } from '~/config/site'
import { getMetaTitle } from '~/lib/utils'

export const headers: HeadersFunction = () => {
  // cache for 5 min
  return { 'Cache-Control': 'public, max-age=300, s-max-age=300' }
}

export const meta: MetaFunction = () => {
  return [{ title: getMetaTitle('Privacy policy') }]
}

export default function PrivacyPolicy() {
  return (
    <div className="container my-10">
      <div className="py-10 md:py-14">
        <h1 className="text-balance text-center text-3xl drop-shadow-md sm:text-5xl">
          Terms Of Use
        </h1>
      </div>
      <div className="prose mx-auto text-justify dark:prose-invert">
        <p>
          By accessing {SITE_NAME}, you agree to the following terms and
          conditions. Please read them carefully.
        </p>
        <p>
          <strong>1. Acceptance of Terms </strong>
          By using {SITE_NAME}, you agree to be bound by these terms. If you do
          not agree, please do not use our site.
        </p>
        <p>
          <strong>2. Use of Content </strong>All content on this site is for
          informational purposes only. You may not reproduce, distribute, or
          modify any content without our prior consent.
        </p>
        <p>
          <strong>3. User Responsibilities </strong>
          You agree to use the website in a lawful manner. Any attempt to harm
          or disrupt the functionality of the site is strictly prohibited.
        </p>
        <p>
          <strong>4. Third-Party Links </strong>
          We may display links to third-party websites or ads via Google
          AdSense. We are not responsible for the content or services of these
          third-party sites.
        </p>
        <p>
          <strong>5. Disclaimer of Warranties </strong>
          {SITE_NAME} is provided "as is." We do not guarantee the accuracy or
          completeness of any information or content on the site.
        </p>
        <p>
          <strong>6. Limitation of Liability </strong>
          We are not liable for any direct, indirect, or incidental damages
          arising from your use of Tomeki Books.
        </p>
        <p>
          <strong>7. Changes to Terms </strong>
          We reserve the right to update these terms at any time. Continued use
          of the site signifies your acceptance of any changes.
        </p>
        <p>
          Everything on {SITE_NAME} is provided free of charge and therefore
          there is no promise this will continue. I'll do my best to keep things
          going, but that's a plan, not a promise.
        </p>
        {/* <p>
          <strong>Contact Us </strong>If you have any questions about this
          policy, please contact us at{' '}
          <a href={`${SITE_URL}/ontact`}>{`${SITE_URL}/ontact`}</a>.
        </p> */}
      </div>
    </div>
  )
}
