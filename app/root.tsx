import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'

import '~/tailwind.css'
import Header from '~/components/header'
import Footer from '~/components/footer'
import GoogleAnalytics from '~/components/google-analytics'
import GoogleAdsScript from '~/components/google-ads/google-ads-script'
import { ProgressBar } from '~/components/progress-bar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="google-adsense-account" content="ca-pub-6892126566030270" />
        <meta
          name="google-site-verification"
          content="1hpD3F6TiKBWMlBhsy7ccjfR_AjyK4L-K4wXCsFijRw"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#" />
        <meta name="theme-color" content="#ffffff" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <GoogleAnalytics />
      <GoogleAdsScript />
      <ProgressBar />
    </>
  )
}
