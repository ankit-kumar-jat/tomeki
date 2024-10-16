import {
  type ErrorResponse,
  isRouteErrorResponse,
  useParams,
  useRouteError,
} from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { trackEvent } from '~/lib/gtag.client'
import { getErrorMessage } from '~/lib/utils'

type StatusHandler = (info: {
  error: ErrorResponse
  params: Record<string, string | undefined>
}) => JSX.Element | null

function GeneralErrorBoundary({
  defaultStatusHandler = ({ error }) => (
    <p>
      {error.status} {error.data}
    </p>
  ),
  statusHandlers,
  unexpectedErrorHandler = error => <p>{getErrorMessage(error)}</p>,
}: {
  defaultStatusHandler?: StatusHandler
  statusHandlers?: Record<number, StatusHandler>
  unexpectedErrorHandler?: (error: unknown) => JSX.Element | null
}) {
  const isReported = useRef<Boolean>(false)
  const error = useRouteError()
  const params = useParams()

  if (typeof document !== 'undefined') {
    console.error(error)
  }

  useEffect(() => {
    if (!isReported.current) {
      setTimeout(
        () => trackEvent('exception', { description: error, fatal: false }),
        500,
      )
      isReported.current = true
    }
  }, [error])

  return (
    <div className="container mx-auto flex items-center justify-center py-20">
      {isRouteErrorResponse(error)
        ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
            error,
            params,
          })
        : unexpectedErrorHandler(error)}
    </div>
  )
}

export { GeneralErrorBoundary }
