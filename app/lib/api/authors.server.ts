import { Author, ListResponse, Work } from '../api-types'
import { openLibApiClient, WEEKLY_CACHE_OPTIONS } from './api-client.server'

export async function getAuthorById({ authorId }: { authorId: string }) {
  const author = await openLibApiClient<Author>(`/authors/${authorId}.json`, {
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
  limit = 20,
  offset = 0,
}: GetBooksByAuthorIdOptions) {
  const authorWorks = await openLibApiClient<ListResponse<Work>>(
    `/authors/${authorId}/works.json`,
    { params: { limit, offset }, cf: WEEKLY_CACHE_OPTIONS },
  )

  return authorWorks
}
