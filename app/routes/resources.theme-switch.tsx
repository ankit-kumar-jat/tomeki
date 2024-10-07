import { json, type ActionFunctionArgs } from '@remix-run/node'
import { redirect, useFetcher, useFetchers } from '@remix-run/react'
import { LaptopIcon, MoonIcon, SunIcon } from 'lucide-react'
import { ServerOnly } from 'remix-utils/server-only'
import { Button } from '~/components/ui/button'
import { useHints } from '~/lib/client-hints'
import { useRequestInfo } from '~/lib/request-info'
import { type Theme, setTheme } from '~/lib/theme.server'
import { isIn } from '~/lib/utils'

const themeTypes = ['system', 'light', 'dark'] as const

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()

  const theme = formData.get('theme')
  const redirectTo = formData.get('redirectTo')

  if (!theme || !isIn(themeTypes, theme)) {
    return json(
      { errorMessage: 'Invalid theme received', success: false },
      { status: 400 },
    )
  }

  if (redirectTo && typeof redirectTo !== 'string') {
    return json(
      { errorMessage: 'Invalid redirectTo received', success: false },
      { status: 400 },
    )
  }

  const responseInit = {
    headers: { 'set-cookie': setTheme(theme) },
  }
  if (redirectTo) {
    return redirect(redirectTo, responseInit)
  } else {
    return json({ success: true, theme }, responseInit)
  }
}

export function ThemeSwitch({
  userPreference,
}: {
  userPreference?: Theme | null
}) {
  const fetcher = useFetcher<typeof action>()
  const requestInfo = useRequestInfo()

  const optimisticMode = useOptimisticThemeMode()
  const mode = optimisticMode ?? userPreference ?? 'system'
  const nextMode =
    mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'
  const modeLabel = {
    light: (
      <>
        <SunIcon />
        <span className="sr-only">Light</span>
      </>
    ),
    dark: (
      <>
        <MoonIcon />
        <span className="sr-only">Dark</span>
      </>
    ),
    system: (
      <>
        <LaptopIcon />
        <span className="sr-only">System</span>
      </>
    ),
  }

  return (
    <fetcher.Form method="POST" action="/resources/theme-switch">
      <ServerOnly>
        {() => (
          <input type="hidden" name="redirectTo" value={requestInfo.path} />
        )}
      </ServerOnly>
      <input type="hidden" name="theme" value={nextMode} />
      <div className="flex gap-2">
        <Button size="icon" variant="ghost" type="submit">
          {modeLabel[mode]}
        </Button>
      </div>
    </fetcher.Form>
  )
}

/**
 * If the user's changing their theme mode preference, this will return the
 * value it's being changed to.
 */
export function useOptimisticThemeMode() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find(
    f => f.formAction === '/resources/theme-switch',
  )

  if (themeFetcher && themeFetcher.formData) {
    const theme = themeFetcher.formData.get('theme')
    const redirectTo = themeFetcher.formData.get('redirectTo')

    if (!theme || !isIn(themeTypes, theme)) {
      return null
    }
    if (redirectTo && typeof redirectTo !== 'string') {
      return null
    }

    return theme
  }
}

/**
 * @returns the user's theme preference, or the client hint theme if the user
 * has not set a preference.
 */
export function useTheme() {
  const hints = useHints()
  const requestInfo = useRequestInfo()
  const optimisticMode = useOptimisticThemeMode()
  if (optimisticMode) {
    return optimisticMode === 'system' ? hints.theme : optimisticMode
  }
  return requestInfo.userPrefs.theme ?? hints.theme
}
