import { Link } from '@remix-run/react'

function Footer() {
  return (
    <footer className="container mt-auto border-t border-border">
      <div className="my-4 flex flex-col-reverse items-center gap-2 text-xs md:flex-row md:items-start md:justify-between">
        <div className="flex items-center justify-center gap-4">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms Of Use</Link>
        </div>
        <Link to="https://openlibrary.org" target="_black">
          Powred By OpenLibray
        </Link>
      </div>
    </footer>
  )
}

export default Footer
