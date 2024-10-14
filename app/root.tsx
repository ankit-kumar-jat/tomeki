import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from '@remix-run/react'
import type { ShouldRevalidateFunction } from '@remix-run/react'

import '~/tailwind.css'
import Header from '~/components/header'
import Footer from '~/components/footer'
import { ProgressBar } from '~/components/progress-bar'
import GoogleAnalytics from '~/components/google-analytics'
import GoogleAdsScript from '~/components/ads/google/google-ads-script'
import { ClientHintCheck, getHints } from '~/lib/client-hints'
import { getTheme, type Theme } from '~/lib/theme.server'
import { cn, getErrorMessage } from '~/lib/utils'
import { ErrorPage } from '~/components/error'
import { GeneralErrorBoundary } from '~/components/error-boundary'
import { SITE_NAME, SITE_URL } from '~/config/site'

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
  const data = useRouteLoaderData<typeof loader>('root')

  const theme =
    data?.requestInfo.userPrefs.theme ?? data?.requestInfo.hints.theme
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
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type":"WebSite",
            "name": "${SITE_NAME}",
            "url": "${SITE_URL}"
          }
        `}</script>
        {/* this should be in head to prevent first time theme blinking */}
        <ClientHintCheck />
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
      <GoogleAnalytics />
      <GoogleAdsScript />
    </>
  )
}

export function ErrorBoundary() {
  const location = useLocation()

  return (
    <GeneralErrorBoundary
      statusHandlers={{
        400: ({ error }) => (
          <ErrorPage
            title="400 - Oh no, you did something wrong."
            subtitle={getErrorMessage(
              error,
              `If you think It is a mistake, let us know...`,
            )}
            action={
              <Link to="/" className="underline">
                Go home
              </Link>
            }
          />
        ),
        500: () => (
          <ErrorPage
            title="500 - Oh no, something did not go well."
            subtitle={`"${location.pathname}" is currently not working. So sorry.`}
            action={
              <Link to="/" className="underline">
                Go home
              </Link>
            }
          />
        ),
      }}
      unexpectedErrorHandler={error => (
        <ErrorPage
          error={error as Error}
          title="500 - Oh no, something did not go well."
          subtitle={`"${location.pathname}" is currently not working. So sorry.`}
          action={
            <Link to="/" className="underline">
              Go home
            </Link>
          }
        />
      )}
    />
  )
}
