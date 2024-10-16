import { Link, NavLink } from '@remix-run/react'
import type { Theme } from '~/lib/theme.server'
import Logo from '~/components/logo'
import { cn } from '~/lib/utils'
import { ThemeSwitch } from '~/routes/resources.theme-switch'

const navLinks = [
  { to: '/', title: 'Home', end: true },
  { to: '/search', title: 'Search' },
  { to: '/blogs', title: 'Explore' },
  { to: '/about', title: 'About' },
]

function Header({ themePreference }: { themePreference?: Theme | null }) {
  return (
    <header className="container border-b border-border py-2 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-row">
        <Link
          to="/"
          prefetch="intent"
          className="-ml-2 flex items-center gap-1 rounded-lg p-1 outline-none ring-foreground focus-visible:ring-2 md:min-w-32"
        >
          <Logo height={36} width={36} />
          <span className="text-xl font-medium">Tomeki</span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap sm:order-none sm:w-auto md:gap-1">
          {navLinks.map(({ title, ...rest }) => (
            <NavLink
              key={title}
              prefetch="intent"
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-2 opacity-85 outline-none ring-foreground hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2',
                  isActive &&
                    'font-medium underline underline-offset-4 opacity-100',
                )
              }
              {...rest}
            >
              {title}
            </NavLink>
          ))}
        </nav>

        <div className="flex justify-end md:min-w-32">
          <ThemeSwitch userPreference={themePreference} />
        </div>
      </div>
    </header>
  )
}

export default Header
