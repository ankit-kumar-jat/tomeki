import type { LoaderFunctionArgs, HeadersFunction } from '@remix-run/cloudflare'
import { json, useLoaderData } from '@remix-run/react'
import { getAuthorById } from '~/lib/api/authors.server'
import { cn } from '~/lib/utils'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const authorId = `${params.authorId}`

  const headers: ResponseInit['headers'] = {
    'Cache-Control': 'public, max-age=86400, s-max-age=86400', // 24*60*60 = 86400 = 24 hours
  }

  const author = await getAuthorById({ authorId })

  if (!author) {
    throw json({ errorMessage: 'Invalid authorId' }, { status: 404, headers })
  }

  return json({ author, authorId }, { headers })
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return loaderHeaders
}

export default function AuthorDetails() {
  const { author } = useLoaderData<typeof loader>()

  return (
    <div className="container">
      <div className="grid lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          {author.bio ? (
            <p className="text-sm leading-snug md:text-base md:leading-snug">
              {typeof author.bio === 'string' ? author.bio : author.bio?.value}
            </p>
          ) : null}
          <div className="space-y-2 text-sm md:text-base">
            <p>
              Personal Name: <strong>{author.personal_name}</strong>
            </p>
            <p>
              Birth Date: <strong>{author.birth_date ?? '-'}</strong>
            </p>
            <p>
              Death Date: <strong>{author.death_date ?? '-'} </strong>
            </p>
            <p>
              Alternate Names:{' '}
              <strong>{author.alternate_names?.join(', ') ?? '-'}</strong>
            </p>
          </div>
        </div>
        <div className="lg:col-span-5">
          {/* This can be used to display ads */}
        </div>
      </div>
    </div>
  )
}
