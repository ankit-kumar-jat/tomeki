import { ListResponse } from './api-types'
export interface Author {
  alternate_names: string[]
  death_date: string
  name: string
  source_records: string[]
  key: string
  birth_date: string
  remote_ids: RemoteIds
  type: Type
  personal_name: string
  latest_revision: number
  revision: number
  created: DateTime
  last_modified: DateTime
}

export interface AuthorRef {
  author: Pick<Author, 'key'>
  type: Type
}

export interface RemoteIds {
  viaf: string
  wikidata: string
  isni: string
}

export interface Type {
  key: string
}

export interface DateTime {
  type: '/type/datetime'
  value: string
}

export type Description =
  | {
      type: string
      value: string
    }
  | string

export interface Work {
  description?: Description
  covers?: number[]
  key: string
  authors: AuthorRef[]
  title: string
  subjects: string[]
  subject_places?: string[]
  subject_times?: string[]
  subject_people?: string[]
  first_publish_date?: string
  type: Type
  latest_revision: number
  revision: number
  created: DateTime
  last_modified: DateTime
}

// Lots of fields are missing from respose
export interface Book {
  type: Type
  publish_date: string
  publish_country: string
  languages?: Pick<Language, 'key'>[]
  authors: Pick<Author, 'key'>[]
  work_titles?: string[]
  other_titles?: string[]
  series?: string[]
  description?: Description
  contributions?: string[]
  subjects?: string[]
  title: string
  subtitle?: string
  by_statement?: string
  publishers?: string[]
  publish_places?: string[]
  pagination?: string
  number_of_pages?: number
  source_records?: string[]
  covers?: number[]
  works: Pick<Work, 'key'>[]
  key: string
  isbn_10?: string[]
  isbn_13?: string[]
  oclc_numbers?: string[]
  dewey_decimal_class?: string[]
  latest_revision: number
  revision: number
  created: DateTime
  last_modified: DateTime
}

export interface Notes {
  type: string
  value: string
}

export interface Language {
  name: string
  key: string
  count: number
}

export interface BookRatings {
  summary: BookRatingsSummary
  counts: BookRatingsCounts
}

export interface BookRatingsSummary {
  average?: number
  count: number
  sortable?: number
}

export interface BookRatingsCounts {
  '1': number
  '2': number
  '3': number
  '4': number
  '5': number
}

export interface Bookshelve {
  counts: BookshelveCounts
}

export interface BookshelveCounts {
  want_to_read: number
  currently_reading: number
  already_read: number
}

export interface ListResponse<T> {
  links: ListResponseLinks
  size: number
  entries: T[]
}

export interface ListResponseLinks {
  self: string
  prev?: string | null
  next?: string | null
}

export interface TrendingWorksResponse {
  query: string
  days: number
  hours: number
  works: TrendingWork[]
}

export interface TrendingWork {
  author_key: string[]
  author_name: string[]
  cover_edition_key: string
  cover_i: number
  edition_count: number
  first_publish_year: number
  has_fulltext: boolean
  ia: string[]
  ia_collection_s: string
  key: string
  language: string[]
  lending_edition_s: string
  lending_identifier_s: string
  public_scan_b: boolean
  title: string
  availability: TrendingWorkAvailability
}

export interface TrendingWorkAvailability {
  status: string
  available_to_browse: boolean
  available_to_borrow: boolean
  available_to_waitlist: boolean
  is_printdisabled: boolean
  is_readable: boolean
  is_lendable: boolean
  is_previewable: boolean
  identifier: string
  isbn: string
  oclc?: unknown
  openlibrary_work: string
  openlibrary_edition: string
  last_loan_date?: unknown
  num_waitlist?: unknown
  last_waitlist_date?: unknown
  is_restricted: boolean
  is_browseable: boolean
  __src__: string
}

export interface SearchResponse<T> {
  numFound: number
  start?: number
  numFoundExact: boolean
  docs: T[]
  num_found?: number
  q?: string
  offset?: number
}

export type SearchWorkItem<K extends SearchWorkKeys[]> = Pick<
  SearchWork,
  K[number]
>

export type SearchAuthorItem<K extends SearchAuthorKeys[]> = Pick<
  SearchAuthor,
  K[number]
>

export interface SearchWork {
  author_alternative_name: string[]
  author_key: string[]
  author_name: string[]
  contributor: string[]
  cover_edition_key: string
  cover_i: number
  ddc: string[]
  ebook_access: string
  ebook_count_i: number
  edition_count: number
  edition_key: string[]
  first_publish_year: number
  first_sentence: string[]
  format: string[]
  has_fulltext: boolean
  ia: string[]
  ia_collection: string[]
  ia_collection_s: string
  isbn: string[]
  key: string
  language: string[]
  last_modified_i: number
  lcc: string[]
  lccn: string[]
  lending_edition_s: string
  lending_identifier_s: string
  number_of_pages_median: number
  oclc: string[]
  osp_count: number
  printdisabled_s: string
  public_scan_b: boolean
  publish_date: string[]
  publish_place: string[]
  publish_year: number[]
  publisher: string[]
  seed: string[]
  title: string
  title_sort: string
  title_suggest: string
  type: string
  id_amazon: string[]
  id_better_world_books: string[]
  id_standard_ebooks: string[]
  id_goodreads: string[]
  id_librarything: string[]
  id_librivox: string[]
  id_project_gutenberg: string[]
  id_dnb: string[]
  id_overdrive: string[]
  subject: string[]
  place: string[]
  time: string[]
  person: string[]
  ia_loaded_id: string[]
  ia_box_id: string[]
  ratings_average?: number
  ratings_sortable?: number
  ratings_count?: number
  ratings_count_1: number
  ratings_count_2: number
  ratings_count_3: number
  ratings_count_4: number
  ratings_count_5: number
  readinglog_count: number
  want_to_read_count: number
  currently_reading_count: number
  already_read_count: number
  publisher_facet: string[]
  person_key: string[]
  time_facet: string[]
  place_key: string[]
  person_facet: string[]
  subject_facet: string[]
  _version_: number
  place_facet: string[]
  lcc_sort: string
  author_facet: string[]
  subject_key: string[]
  ddc_sort: string
  time_key: string[]
}

export type SearchWorkKeys = keyof SearchWork

export interface SearchAuthor {
  alternate_names: string[]
  birth_date: string
  date: string
  death_date: string
  key: string
  name: string
  top_subjects: string[]
  top_work: string
  type: string
  work_count: number
  ratings_average: number
  ratings_sortable: number
  ratings_count: number
  ratings_count_1: number
  ratings_count_2: number
  ratings_count_3: number
  ratings_count_4: number
  ratings_count_5: number
  want_to_read_count: number
  already_read_count: number
  currently_reading_count: number
  readinglog_count: number
  _version_: number
}

export type SearchAuthorKeys = keyof SearchAuthor

export interface SearchSubject {
  key: string
  name: string
  subject_type: string
  work_count: number
  type: string
  count: number
}

export interface SearchList {
  url: string
  full_url: string
  name: string
  seed_count: number
  last_update: string | null
}

export interface WorksBySubjectResponse {
  key: string
  name: string
  subject_type: string
  work_count: number
  works: WorkBySubjectItem[]
}

export interface WorkBySubjectItem {
  key: string
  title: string
  edition_count: number
  cover_id: number
  cover_edition_key: string | null
  subject: string[]
  ia_collection: string[]
  lendinglibrary: boolean
  printdisabled: boolean
  lending_edition: string
  lending_identifier: string
  authors: Pick<Author, 'key' | 'name'>[]
  first_publish_year: number
  ia: string
  public_scan: boolean
  has_fulltext: boolean
}

export type SortOprions =
  | 'editions'
  | 'old'
  | 'new'
  | 'rating'
  | 'rating asc'
  | 'rating desc'
  | 'readinglog'
  | 'want_to_read'
  | 'currently_reading'
  | 'already_read'
  | 'title'
  | 'scans'
  | 'lcc_sort'
  | 'lcc_sort asc'
  | 'lcc_sort desc'
  | 'ddc_sort'
  | 'ddc_sort asc'
  | 'ddc_sort desc'
  | 'ebook_access'
  | 'ebook_access asc'
  | 'ebook_access desc'
  | 'key'
  | 'key asc'
  | 'key desc'
  | 'random'
  | 'random asc'
  | 'random desc'
  | 'random.hourly'
  | 'random.daily'
