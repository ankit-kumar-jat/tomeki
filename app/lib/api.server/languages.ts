import { Language } from '../api-types'
import { apiClient, WEEKLY_CACHE_OPTIONS } from './api-client'

interface getLanguagesOptions {
  limit?: number
  offset?: number
}

export async function getLanguages({
  limit = 600, //To get all languages at once
  offset = 0,
}: getLanguagesOptions = {}) {
  const languages = await apiClient<Language[]>('/languages.json', {
    params: { limit, offset },
    cf: WEEKLY_CACHE_OPTIONS,
    cache: 'force-cache',
  })

  return formatLanguages(languages)
}

function formatLanguages(languages?: Language[]) {
  if (!languages) return []

  return languages.map(language => ({
    title: language.name,
    langId: language.key.split('/').pop(),
    booksCount: language.count,
  }))
}
