import type { MetaFunction } from '@remix-run/node'
import { NavLink, Outlet } from '@remix-run/react'
import { cn } from '~/lib/utils'

export const meta: MetaFunction = () => {
  return [
    { title: 'Search Millions of Books Instantly | Tomeki' },
    {
      name: 'description',
      content:
        'Search, discover, and dive into millions of books with ease. Find your next favorite read on Tomeki!',
    },
  ]
}

const navLinks = [
  { to: '', title: 'Books', end: true },
  { to: 'authors', title: 'Authors' },
  { to: 'subjects', title: 'Subjects' },
  { to: 'lists', title: 'Lists' },
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
