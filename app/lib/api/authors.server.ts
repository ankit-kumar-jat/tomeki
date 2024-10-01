import { Author, ListResponse, Work } from '../api-types'
import { openLibApiClient, WEEKLY_CACHE_OPTIONS } from './api-client.server'

export async function getAuthorById({ authorId }: { authorId: string }) {
  const author = await openLibApiClient<Author>(`/author/${authorId}.json`, {
    cf: WEEKLY_CACHE_OPTIONS,
  })

  return author
}

interface GetBooksByAuthorIdOptions {
  authorId: string
  limit?: number
  offset?: number
}

export async function getWorksByAuthorId({
  authorId,
}: GetBooksByAuthorIdOptions) {
  const authorWorks = await openLibApiClient<ListResponse<Work>>(
    `/author/${authorId}/works.json`,
    { cf: WEEKLY_CACHE_OPTIONS },
  )

  return authorWorks
}
