import { Author, ListResponse, Work } from '../api-types'
import { apiClient, WEEKLY_CACHE_OPTIONS } from './api-client.server'

export async function getAuthorById({ authorId }: { authorId: string }) {
  const author = await apiClient<Author>(`/author/${authorId}.json`, {
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
  const authorWorks = await apiClient<ListResponse<Work>>(
    `/author/${authorId}/works.json`,
    { cf: WEEKLY_CACHE_OPTIONS },
  )

  return authorWorks
}
