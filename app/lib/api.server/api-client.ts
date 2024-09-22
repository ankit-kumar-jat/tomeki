export const API_URL = "https://openlibrary.org/";

// For caching using cludflare use cf option
// https://developers.cloudflare.com/workers/runtime-apis/request/#the-cf-property-requestinitcfproperties

export const NO_CACHE_OPTIONS: RequestInitCfProperties = { cacheTtl: 0 };
export const HOURLY_CACHE_OPTIONS: RequestInitCfProperties = {
  cacheTtlByStatus: {
    "200-299": 2 * 60 * 60, // 1 hour
    "404": 10 * 60, //10 minutes
    "500-599": 0,
  },
};
export const DAILY_CACHE_OPTIONS: RequestInitCfProperties = {
  cacheTtlByStatus: {
    "200-299": 24 * 60 * 60, // 24 hours
    "404": 1 * 60 * 60, // 1 hour
    "500-599": 0,
  },
};

export const WEEKLY_CACHE_OPTIONS: RequestInitCfProperties = {
  cacheTtlByStatus: {
    "200-299": 7 * 24 * 60 * 60, // 7days
    "404": 1 * 60 * 60, // 1 hour
    "500-599": 0,
  },
};

export async function apiClient<T>(
  endpoint: string,
  {
    body,
    params,
    ...customConfig
  }: RequestInit & { body?: object; params?: object } = {}
) {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.substring(1);
  }
  const url = new URL(endpoint, API_URL);
  const headers = {
    "Content-Type": "application/json",
    "Accept-Encoding": "gzip, br",
    // TODO: load email from env
    "User-Agent": "Novalla/1.0 (ankit@yopmail.com)",
  };

  const config: RequestInit = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, encodeURIComponent(value));
    }
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(url.toString(), config);

  if (res.ok) {
    const isJson = res.headers
      .get("content-type")
      ?.includes("application/json");

    if (!isJson) {
      throw new Error(
        `Expected json from api, got: ${res.headers.get("content-type")}`
      );
    }
    const data: T = await res.json();
    return data;
  }
  if (res.status === 404) return;

  throw new Error(`Fetch for api failed with code: ${res.status}`);
}
