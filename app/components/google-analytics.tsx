function GoogleAnalytics() {
  const isProd = process.env.NODE_ENV !== 'development'

  if (!isProd) return
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=G-7DWEG1YQ09`}
      />
      <script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7DWEG1YQ09');`,
        }}
      />
    </>
  )
}

export default GoogleAnalytics
