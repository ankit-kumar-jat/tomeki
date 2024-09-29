import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SITE_NAME, SITE_URL } from '~/config/site'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isIn<T>(values: readonly T[], x: any): x is T {
  return values.includes(x)
}

export function getMetaTitle(title: string) {
  return `${title} | ${SITE_NAME}`
}

export function getFullURL(path: string) {
  return `${SITE_URL}${path}`
}

export interface CoverImageOptions {
  type: 'isbn' | 'oclc' | 'olid' | 'id'
  id: string | number
  size?: 'S' | 'M' | 'L'
}

export function getCoverImage({ type, id, size = 'M' }: CoverImageOptions) {
  return `https://covers.openlibrary.org/b/${type}/${id}-${size}.jpg`
}

export interface AuthorImageOptions {
  type: 'olid' | 'id'
  id: string | number
  size?: 'S' | 'M' | 'L'
}

export function getAuthorImage({ type, id, size = 'M' }: AuthorImageOptions) {
  return `https://covers.openlibrary.org/a/${type}/${id}-${size}.jpg`
}

/**
 * Merge multiple headers objects into one (uses set so headers are overridden)
 */
export function mergeHeaders(
  ...headers: Array<ResponseInit['headers'] | null | undefined>
) {
  const merged = new Headers()
  for (const header of headers) {
    if (!header) continue
    for (const [key, value] of new Headers(header).entries()) {
      merged.set(key, value)
    }
  }
  return merged
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 */
export function combineHeaders(
  ...headers: Array<ResponseInit['headers'] | null | undefined>
) {
  const combined = new Headers()
  for (const header of headers) {
    if (!header) continue
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value)
    }
  }
  return combined
}
