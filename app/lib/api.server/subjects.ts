import { SortOprions, WorksBySubjectResponse } from '../api-types'
import { apiClient, WEEKLY_CACHE_OPTIONS } from './api-client'

interface PopularSubject {
  id: string
  title: string
  icon: string | null
}
export const popularSubjects: PopularSubject[] = [
  { id: 'art', title: 'Art', icon: null },
  { id: 'science_fiction', title: 'Science Fiction', icon: null },
  { id: 'fantasy', title: 'Fantasy', icon: null },
  { id: 'biographies', title: 'Biographies', icon: null },
  { id: 'recipes', title: 'Recipes', icon: null },
  { id: 'romance', title: 'Romance', icon: null },
  { id: 'textbooks', title: 'Textbooks', icon: null },
  { id: 'children', title: 'Children', icon: null },
  { id: 'history', title: 'History', icon: null },
  { id: 'medicine', title: 'Medicine', icon: null },
  { id: 'religion', title: 'Religion', icon: null },
  {
    id: 'mystery_and_detective_stories',
    title: 'Mystery and Detective Stories',
    icon: null,
  },
  { id: 'plays', title: 'Plays', icon: null },
  { id: 'music', title: 'Music', icon: null },
  { id: 'science', title: 'Science', icon: null },
]

interface GetWorksBySubjectOptions {
  subject: string
  limit?: number
  offset?: number
  sort?: SortOprions
}
export async function getWorksBySubject({
  subject,
  limit = 20,
  offset = 0,
  sort,
}: GetWorksBySubjectOptions) {
  const subjectWorksRes = await apiClient<WorksBySubjectResponse>(
    `/subjects/${subject}.json`,
    {
      params: { limit, offset, sort },
      cf: WEEKLY_CACHE_OPTIONS,
    },
  )

  return formatWorksBySubjectRes(subjectWorksRes)
}

function formatWorksBySubjectRes(subjectWorksRes?: WorksBySubjectResponse) {
  if (!subjectWorksRes)
    return {
      title: '',
      key: '',
      totalWorks: 0,
      works: [],
    }

  return {
    title: subjectWorksRes.name,
    key: subjectWorksRes.key,
    totalWorks: subjectWorksRes.work_count,
    works: subjectWorksRes.works.map(work => ({
      title: work.title,
      authors: work.authors.map(author => ({
        key: author.key,
        id: author.key.split('/').pop(),
        name: author.name,
      })),
      key: work.key,
      workId: work.key.split('/').pop(),
      coverId: work.cover_id,
      coverEditionId: work.cover_edition_key,
      leadingEditionId: work.lending_edition,
      firstPublishYear: work.first_publish_year,
    })),
  }
}
