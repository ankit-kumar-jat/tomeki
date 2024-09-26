import {
  SearchAuthorItem,
  SearchAuthorKeys,
  SearchList,
  SearchResponse,
  SearchSubject,
  SearchWorkItem,
  SearchWorkKeys,
} from '../api-types'
import { apiClient, DAILY_CACHE_OPTIONS } from './api-client'

interface BaseSearchOptions {
  q: string
  offset?: number
  limit?: number
}

interface SearchWorksOptions<T> extends BaseSearchOptions {
  sort?: (typeof searchWorksSortValues)[number]
  fields: T[]
}

interface SearchAuthorsOptions<T> extends BaseSearchOptions {
  sort?: 'work_count desc'
  fields: T[]
}

export const searchWorksSortValues = [
  'old',
  'new',
  'rating',
  'readinglog',
  'editions',
] as const

// https://openlibrary.org/search.json?q=subject%3Aromance&mode=everything&sort=rating&limit=1
// https://openlibrary.org/search.json?q=key:/works/OL16336633W

export async function searchWorks<T extends SearchWorkKeys>({
  q,
  fields,
  sort,
  offset,
  limit = 20,
}: SearchWorksOptions<T>) {
  const searchWorksRes = await apiClient<
    SearchResponse<SearchWorkItem<typeof fields>>
  >('/search.json', {
    params: { q, fields: fields.join(','), sort, offset, limit },
    cf: DAILY_CACHE_OPTIONS,
  })

  // return fromatSearchWorksRes(searchWorksRes)
  return searchWorksRes
}

export async function searchAuthors<T extends SearchAuthorKeys>({
  q,
  fields,
  sort,
  offset = 0,
  limit = 20,
}: SearchAuthorsOptions<T>) {
  const searchRes = await apiClient<
    SearchResponse<SearchAuthorItem<typeof fields>>
  >('/search/authors.json', {
    params: { q, fields: fields.join(','), sort, offset, limit },
    cf: DAILY_CACHE_OPTIONS,
  })

  return searchRes
}

export async function searchSubjects({
  q,
  offset = 0,
  limit = 20,
}: BaseSearchOptions) {
  const searchRes = await apiClient<SearchResponse<SearchSubject>>(
    '/search/subjects.json',
    { params: { q, offset, limit }, cf: DAILY_CACHE_OPTIONS },
  )

  return searchRes
}

export async function searchLists({
  q,
  offset = 0,
  limit = 20,
}: BaseSearchOptions) {
  const searchRes = await apiClient<SearchResponse<SearchList>>(
    '/search/lists.json',
    { params: { q, offset, limit }, cf: DAILY_CACHE_OPTIONS },
  )

  return searchRes
}

// function fromatSearchWorksRes(searchWorksRes) {
//   if (!searchWorksRes) {
//     return {
//       numFound: 0,
//       foundExact: false,
//       works: [],
//     }
//   }

//   return {
//     numFound: searchWorksRes.numFound || searchWorksRes.num_found,
//     foundExact: searchWorksRes.numFoundExact,
//     works: searchWorksRes.docs.map(work => ({
//       title: work.title,
//       coverId: work.cover_i,
//       coverEditionId: work.cover_edition_key,
//       editionCount: work.edition_count,
//       firstPublishYear: work.first_publish_year,
//       key: work.key,
//       languages: work.language,
//       pagesCount: work.number_of_pages_median,
//       ratingsAvg: work.ratings_average ?? 0,
//       ratingsSortable: work.ratings_sortable ?? 0,
//       ratingsCount: work.ratings_count ?? 0,
//       ratingCount1: work.ratings_count_1 ?? 0,
//       ratingCount2: work.ratings_count_2 ?? 0,
//       ratingCount3: work.ratings_count_3 ?? 0,
//       ratingCount4: work.ratings_count_4 ?? 0,
//       ratingCount5: work.ratings_count_5 ?? 0,
//       wantToRead: work.want_to_read_count ?? 0,
//       reading: work.currently_reading_count ?? 0,
//       alreadyRead: work.already_read_count ?? 0,
//       subjects: work.subject_key
//         ? work.subject_key.map((id, index) => ({
//             id,
//             name: work.subject?.[index] ? work.subject[index] : null,
//           }))
//         : [],
//       persons: work.person_key
//         ? work.person_key.map((id, index) => ({
//             id,
//             name: work.person?.[index] ? work.person[index] : null,
//           }))
//         : [],
//       places: work.place_key
//         ? work.place_key.map((id, index) => ({
//             id,
//             name: work.place?.[index] ? work.place[index] : null,
//           }))
//         : [],
//       authors: work.author_key
//         ? work.author_key.map((id, index) => ({
//             id,
//             name: work.author_name?.[index] ? work.author_name[index] : null,
//           }))
//         : [],

//       amazonIds: work.id_amazon,
//       goodreadIds: work.id_goodreads,
//       betterWorldBooksIds: work.id_better_world_books,
//       librarytingIds: work.id_librarything,
//     })),
//   }
// }
