import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function getAuthorImage(options: AuthorImageOptions) {
  return getCoverImage(options)
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
