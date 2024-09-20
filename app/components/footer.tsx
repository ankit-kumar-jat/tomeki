import { Link } from '@remix-run/react'

function Footer() {
  return (
    <footer className="container mt-auto border-t border-border">
      <div className="my-2 flex flex-col-reverse items-center gap-2 text-xs text-muted-foreground md:flex-row md:items-start md:justify-between">
        <p>&copy;Ankit Kumar Jat - 2024</p>
        <Link to="https://openlibrary.org" target="_black">
          Powred By OpenLibray
        </Link>
      </div>
    </footer>
  )
}

export default Footer
