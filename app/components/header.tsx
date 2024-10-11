import { Link, NavLink } from '@remix-run/react'
import type { Theme } from '~/lib/theme.server'
import Logo from '~/components/logo'
import { cn } from '~/lib/utils'
import { ThemeSwitch } from '~/routes/resources.theme-switch'

const navLinks = [
  { to: '/', title: 'Home', end: true },
  { to: '/search', title: 'Search' },
  { to: '/blogs', title: 'Explore All' },
  { to: '/about', title: 'About' },
]

function Header({ themePreference }: { themePreference?: Theme | null }) {
  return (
    <header className="container border-b border-border py-2 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-row">
        <Link to="/" className="flex items-center gap-1 md:min-w-32">
          <Logo height={36} width={36} />
          <span className="text-xl font-medium">Tomeki</span>
        </Link>

        <nav className="order-3 flex w-full flex-wrap gap-3 sm:order-none sm:w-auto">
          {navLinks.map(({ title, ...rest }) => (
            <NavLink
              key={title}
              className={({ isActive }) =>
                cn(
                  'opacity-85 hover:opacity-100 focus-visible:opacity-100',
                  isActive && 'font-medium opacity-100',
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
