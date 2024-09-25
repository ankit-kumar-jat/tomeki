import { TrendingWorksResponse } from '../api-types'
import { apiClient, DAILY_CACHE_OPTIONS } from './api-client'

interface GetTrendingWorksOptions {
  type: 'now' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'forever'
  limit?: number
}

export async function getTrendingWorks({
  type,
  limit = 20,
}: GetTrendingWorksOptions) {
  const trendingApiRes = await apiClient<TrendingWorksResponse>(
    `/trending/${type}.json`,
    {
      params: { limit },
      cf: DAILY_CACHE_OPTIONS,
      cache: 'force-cache',
    },
  )

  return formatTrendingWorks(trendingApiRes)
}

function formatTrendingWorks(
  trendingApiRes: TrendingWorksResponse | undefined,
) {
  if (trendingApiRes?.works) {
    return trendingApiRes.works.map(trendingWork => ({
      title: trendingWork.title,
      authors: trendingWork.author_key.map((authorId, index) => ({
        id: authorId,
        name: trendingWork.author_name[index],
      })),
      key: trendingWork.key,
      workId: trendingWork.key.split('/').pop() ?? '',
      coverId: trendingWork.cover_i,
      coverEditionId: trendingWork.cover_edition_key,
      firstPublishYear: trendingWork.first_publish_year,
    }))
  }

  return []
}
