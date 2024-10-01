import { Link, NavLink } from '@remix-run/react'
import Logo from '~/components/logo'
import { cn } from '~/lib/utils'

const navLinks = [
  { to: '/', title: 'Home', end: true },
  { to: '/search', title: 'Search' },
  { to: '/blogs', title: 'Blog' },
  { to: '/about', title: 'About Us' },
]

function Header() {
  return (
    <header className="container border-b border-border py-2 sm:py-4">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <Link to="/" className="flex items-center gap-1">
          <Logo height={36} width={36} />
          <span className="text-xl font-medium">Tomeki</span>
        </Link>

        <nav className="font flex flex-wrap gap-3">
          {navLinks.map(({ title, ...rest }) => (
            <NavLink
              key={title}
              className={({ isActive }) =>
                cn(
                  'opacity-85 hover:opacity-100 focus-visible:opacity-100',
                  isActive && 'opacity-100',
                )
              }
              {...rest}
            >
              {title}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
