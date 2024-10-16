import { GOOGLE_ANALYTICS_ID } from '~/config/site'

function GoogleAnalytics() {
  const isProd = import.meta.env.PROD

  if (!isProd || !GOOGLE_ANALYTICS_ID) return
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
      />
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');`,
        }}
      />
    </>
  )
}

export default GoogleAnalytics
