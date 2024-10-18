import type { LoaderFunctionArgs } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const labelsSelected = url.searchParams.getAll('labels')

  if (labelsSelected.length > 0) {
    const searchParams = new URLSearchParams()
    labelsSelected.map(label => searchParams.append('category', label))
    return redirect(`/explore?${searchParams.toString()}`, 301)
  }

  return redirect('/explore', 301)
}
