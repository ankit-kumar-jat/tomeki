import { Link, useLocation } from '@remix-run/react'
import { ErrorPage } from '~/components/error'
import { GeneralErrorBoundary } from '~/components/error-boundary'

export async function loader() {
  throw new Response('Not found', { status: 404 })
}

export default function NotFound() {
  // due to the loader, this component will never be rendered, but we'll return
  // the error boundary just in case.
  return <ErrorBoundary />
}

export function ErrorBoundary() {
  const location = useLocation()
  return (
    <GeneralErrorBoundary
      statusHandlers={{
        404: () => (
          <ErrorPage
            title="404 - Oh no, We can't find this page."
            subtitle={`"${location.pathname}" is not a page. So sorry.`}
            action={
              <Link to="/" className="text-lg underline">
                Go home
              </Link>
            }
          />
        ),
      }}
    />
  )
}
