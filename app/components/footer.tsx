import { Link } from '@remix-run/react'
import { RssIcon } from 'lucide-react'
import Logo from '~/components/logo'

function Footer() {
  return (
    <footer className="mt-16">
      <div className="container flex flex-col items-center gap-6 border-b py-4 text-xs md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/" className="flex items-center gap-1">
            <Logo height={36} width={36} />
            <span className="text-xl font-medium">Tomeki</span>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Link className="hover:underline" to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="hover:underline" to="/terms-of-use">
            Terms Of Use
          </Link>
          <Link className="hover:underline" to="/affiliate-disclosure">
            Affiliate Disclosure
          </Link>
        </div>
      </div>
      <div className="container my-4 flex flex-col-reverse items-center gap-2 text-xs md:flex-row md:justify-between">
        <p>© 2024 Tomeki. All Rights Reserved.</p>
        <Link
          to="/rss.xml"
          className="inline-flex items-center gap-2 hover:underline"
        >
          <RssIcon width={12} /> RSS
        </Link>
      </div>
    </footer>
  )
}

export default Footer
