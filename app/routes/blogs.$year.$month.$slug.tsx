import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'

export async function loader({ params }: LoaderFunctionArgs) {
  const path = `/${params.year}/${params.month}/${params.slug}`

  return redirect(path, 301)
}
