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
