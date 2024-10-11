import type { MetaFunction, HeadersFunction } from '@remix-run/cloudflare'
import { SITE_NAME, SITE_URL } from '~/config/site'
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
          Privacy Policy
        </h1>
      </div>
      <div className="prose mx-auto text-justify dark:prose-invert lg:prose-lg">
        <p>
          At {SITE_NAME}, accessible from{' '}
          <a href={SITE_URL} target="_blank">
            {SITE_URL}
          </a>
          , your privacy is a priority. This policy outlines how we collect,
          use, and safeguard your information.
        </p>
        <p>
          <strong>1. Information We Collect </strong>We collect information
          using:
          <ul>
            <li>
              <strong>Google Analytics: </strong>
              This helps us analyze site traffic and user behavior to improve
              your experience. It tracks non-personally identifiable information
              such as your IP address, browser type, device type, and pages
              visited.
            </li>
            <li>
              <strong>Google AdSense: </strong>We display ads on our website
              through Google AdSense, which may use cookies to serve relevant
              ads based on your interests.
            </li>
            <li>
              <strong>ConvertKit: </strong>We collect your email address via
              ConvertKit if you subscribe to our newsletter. This email is used
              to send you updates and promotional content.
            </li>
          </ul>
        </p>
        <p>
          <strong>2. Use of Cookies </strong>Both Google Analytics and Google
          AdSense use cookies to collect and store information. You can disable
          cookies in your browser settings if you prefer.
        </p>
        <p>
          <strong>3. Data Sharing </strong>We do not share personal information
          with third parties, except as required by Google Analytics, AdSense,
          and ConvertKit for their services.
        </p>
        <p>
          <strong>4. Your Choices </strong>You may opt-out of personalized ads
          by visiting the Google{' '}
          <a href="https://adssettings.google.com/" target="_blank">
            Ad Settings page.
          </a>{' '}
          You can also unsubscribe from our newsletter at any time by using the
          link provided in our emails.
        </p>
        <p>
          <strong>5. Changes to This Policy </strong>We may update this policy
          from time to time. Any changes will be reflected on this page.
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
