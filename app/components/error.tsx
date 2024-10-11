import React from 'react'
import clsx from 'clsx'
import errorStack from 'error-stack-parser'

function ErrorStack({ error }: { error: Error }) {
  const [isVisible, setIsVisible] = React.useState(true)
  const frames = errorStack.parse(error)

  return (
    <div
      className={clsx(
        'fixed inset-0 z-10 flex items-center justify-center transition',
        {
          'pointer-events-none opacity-0': !isVisible,
        },
      )}
    >
      <button
        className="absolute inset-0 block h-full w-full bg-muted/50"
        onClick={() => setIsVisible(false)}
      />
      <div className="relative my-8 max-h-[calc(100lvh_-_64px)] w-full max-w-4xl overflow-y-auto rounded-lg border-t-8 border-destructive bg-background p-12 text-foreground shadow-xl">
        <pre className="text-xl font-semibold text-red-600 drop-shadow-md">
          {error.message}
        </pre>
        <div>
          {frames.map(frame => (
            <div
              key={[frame.fileName, frame.lineNumber, frame.columnNumber].join(
                '-',
              )}
              className="pt-4"
            >
              <div className="pt-2 font-medium">at {frame.functionName}</div>
              <div className="font-mono opacity-75">
                {frame.fileName}:{frame.lineNumber}:{frame.columnNumber}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ErrorPage({
  error,
  title,
  subtitle,
  image,
  action,
}: {
  error?: Error
  title: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  image?: string
}) {
  return (
    <main className="relative max-w-lg">
      {error && import.meta.env.DEV ? <ErrorStack error={error} /> : null}
      {image && (
        <img
          src={image}
          alt=""
          className="mx-auto mb-8 h-auto max-h-72 w-full max-w-full object-contain"
        />
      )}
      <h1 className="text-xl sm:text-2xl md:text-3xl">{title}</h1>
      <p className="mb-4 mt-2 text-base">{subtitle}</p>
      {action}
    </main>
  )
}

export { ErrorPage }
