import { NavLink, Outlet } from '@remix-run/react'
import { cn } from '~/lib/utils'

const navLinks = [
  { to: '', title: 'Books', end: true },
  { to: 'authors', title: 'Authors' },
  { to: 'subjects', title: 'Subjects' },
  // { to: 'lists', title: 'Lists' },
]

export default function Index() {
  return (
    <div>
      <div className="container my-4 border-b md:my-6 lg:my-8">
        <nav className="flex gap-2">
          {navLinks.map(({ title, ...rest }) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'border-b-[3px] border-b-transparent px-2 py-1',
                  isActive && 'border-b-foreground',
                )
              }
              key={title}
              {...rest}
            >
              {title}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="container my-6 lg:my-8">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
