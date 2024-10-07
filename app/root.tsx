import type { LoaderFunctionArgs } from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import type { ShouldRevalidateFunction } from '@remix-run/react'

import '~/tailwind.css'
import Header from '~/components/header'
import Footer from '~/components/footer'
import { ProgressBar } from '~/components/progress-bar'
import GoogleAnalytics from '~/components/google-analytics'
import GoogleAdsScript from '~/components/ads/google/google-ads-script'
import InfolinksAdsScript from './components/ads/infolinks/infolinks-ads-script'
import { ClientHintCheck, getHints } from '~/lib/client-hints'
import { getTheme, type Theme } from '~/lib/theme.server'
import { cn } from '~/lib/utils'
import { useTheme } from '~/routes/resources.theme-switch'

export async function loader({ request, context }: LoaderFunctionArgs) {
  return {
    requestInfo: {
      hints: getHints(request),
      path: new URL(request.url).pathname,
      userPrefs: {
        theme: getTheme(request),
      },
    },
  }
}

export type RootLoaderType = typeof loader

export const shouldRevalidate: ShouldRevalidateFunction = ({ formAction }) => {
  if (formAction === '/resources/theme-switch') {
    return true // only revalidate switch theme action is called
  }
  return false
}

export function Layout({ children }: { children: React.ReactNode }) {
  const theme = useTheme()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="google-adsense-account" content="ca-pub-6892126566030270" />
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
        <meta
          name="theme-color"
          content={theme === 'dark' ? '#000000' : '#ffffff'}
        />
        <Meta />
        <Links />
      </head>
      <body
        className={cn(
          'bg-background text-foreground',
          theme === 'dark' ? 'dark' : 'light',
        )}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const data = useLoaderData<typeof loader>()
  return (
    <>
      <Header themePreference={data.requestInfo.userPrefs.theme} />
      <Outlet />
      <Footer />
      <ProgressBar />
      <ClientHintCheck />
      <GoogleAnalytics />
      <GoogleAdsScript />
      <InfolinksAdsScript />
    </>
  )
}
