export const OPEN_LIBRARY_API_URL = 'https://openlibrary.org/'
export const GOOGLE_BLOGGER_API_URL =
  'https://blogger.googleapis.com/v3/blogs/3354417192831064260/'

// For caching using cludflare use cf option
// https://developers.cloudflare.com/workers/runtime-apis/request/#the-cf-property-requestinitcfproperties

export const NO_CACHE_OPTIONS: RequestInitCfProperties = { cacheTtl: 0 }
export const HOURLY_CACHE_OPTIONS: RequestInitCfProperties = {
  cacheTtlByStatus: {
    '200-299': 2 * 60 * 60, // 1 hour
    '404': 10 * 60, //10 minutes
    '500-599': 0,
  },
  cacheEverything: true,
}
export const DAILY_CACHE_OPTIONS: RequestInitCfProperties = {
  cacheTtlByStatus: {
    '200-299': 24 * 60 * 60, // 24 hours
    '404': 1 * 60 * 60, // 1 hour
    '500-599': 0,
  },
  cacheEverything: true,
}

export const WEEKLY_CACHE_OPTIONS: RequestInitCfProperties = {
  cacheTtlByStatus: {
    '200-299': 7 * 24 * 60 * 60, // 7days
    '404': 1 * 60 * 60, // 1 hour
    '500-599': 0,
  },
  cacheEverything: true,
}

export async function apiClient<T>(
  { endpoint, url }: { endpoint: string; url: string },
  { body, params, ...customConfig }: RequestInit & { params?: object } = {},
) {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.substring(1)
  }
  const fullUrl = new URL(endpoint, url)
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, br',
    'User-Agent': 'Tomeki/1.0 (ankit@yopmail.com , gzip)',
  }

  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
    cache: undefined,
    body,
  }

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        fullUrl.searchParams.set(key, value)
      }
    }
  }

  console.log('🚀 ~ Fetch url:', fullUrl.toString())
  const res = await fetch(fullUrl.toString(), config)

  if (res.ok) {
    const isJson = res.headers.get('content-type')?.includes('application/json')

    if (!isJson) {
      throw new Error(
        `Expected json from api, got: ${res.headers.get('content-type')}`,
      )
    }
    const data: T = await res.json()
    return data
  }
  if (res.status === 404) return

  console.warn(await res.text())
  throw new Error(`Fetch for api failed with code: ${res.status}`)
}

export async function openLibApiClient<T>(
  endpoint: string,
  requestInit: RequestInit & { body?: object; params?: object } = {},
) {
  return apiClient<T>({ endpoint, url: OPEN_LIBRARY_API_URL }, requestInit)
}

export async function bloggerApiClient<T>(
  endpoint: string,
  requestInit: RequestInit & { body?: object; params?: object } = {},
) {
  return apiClient<T>({ endpoint, url: GOOGLE_BLOGGER_API_URL }, requestInit)
}
