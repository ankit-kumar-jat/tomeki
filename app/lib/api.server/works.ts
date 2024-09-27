import { Book, BookRatings, Bookshelve, ListResponse, Work } from '../api-types'
import { apiClient, WEEKLY_CACHE_OPTIONS } from './api-client'

export async function getWorkById({ workId }: { workId: string }) {
  const work = await apiClient<Work>(`/works/${workId}.json`, {
    cf: WEEKLY_CACHE_OPTIONS,
  })

  return work
}

export async function getWorkEditions({ workId }: { workId: string }) {
  const workEditionsRes = await apiClient<ListResponse<Book>>(
    `/works/${workId}/editions.json`,
    {
      cf: WEEKLY_CACHE_OPTIONS,
    },
  )

  return workEditionsRes
}

export async function getBookshelveDataByWorkId({
  workId,
}: {
  workId: string
}) {
  const bookshelveData = await apiClient<Bookshelve>(
    `/books/${workId}/bookshelves.json`,
    { cf: WEEKLY_CACHE_OPTIONS },
  )

  return formatBookshelveRes(bookshelveData)
}

export async function getRatingsByWorkId({ workId }: { workId: string }) {
  const ratings = await apiClient<BookRatings>(
    `/books/${workId}/ratings.json`,
    { cf: WEEKLY_CACHE_OPTIONS },
  )

  return ratings
}

export async function getEditionById({ editionId }: { editionId: string }) {
  const edition = await apiClient<Book>(`/books/${editionId}.json`, {
    cf: WEEKLY_CACHE_OPTIONS,
  })

  return formatEdition(edition)
}

export function formatWork(work?: Work) {
  if (!work) return undefined
  return {
    title: work.title,
    covers: work.covers,
    key: work.key,
    workId: work.key.split('/').pop() ?? '',
    description:
      typeof work.description === 'string'
        ? work.description
        : work.description?.value,
    subjects: work.subjects,
    subjectPlaces: work.subject_places,
    subjectTimes: work.subject_times,
    subjectPeople: work.subject_people,
    authors: work.authors.map(author => ({
      key: author.author.key,
      authorId: author.author.key.split('/').pop() ?? '',
    })),
  }
}

export function formatEdition(edition?: Book) {
  if (!edition) return undefined

  return {
    title: edition.title,
    covers: edition.covers ? edition.covers : [],
    key: edition.key,
    editionId: edition.key.split('/').pop() ?? '',
    pagesCount: edition.number_of_pages,
    languages: edition.languages
      ? edition.languages.map(language => language.key)
      : [],
    subjects: edition.subjects,
    description:
      typeof edition.description === 'string'
        ? edition.description
        : edition.description?.value,
    works: edition.works,
    authors: edition.authors,
  }
}

export function formatWorkEditionsRes(workEditionsRes?: ListResponse<Book>) {
  if (!workEditionsRes) {
    return {
      totalEditions: 0,
      editions: [],
    }
  }
  return {
    totalEditions: workEditionsRes.size,
    editions: workEditionsRes.entries.map(formatEdition),
  }
}

export function formatBookshelveRes(bookshelveData?: Bookshelve) {
  if (!bookshelveData) {
    return {
      wantToRead: 0,
      reading: 0,
      alreadyRead: 0,
    }
  }

  return {
    wantToRead: bookshelveData.counts.want_to_read,
    reading: bookshelveData.counts.currently_reading,
    alreadyRead: bookshelveData.counts.already_read,
  }
}
