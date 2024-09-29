import { Link, useRouteLoaderData } from '@remix-run/react'
import { LoaderType } from './books.$bookId'

export default function BookDetails() {
  const bookDetailsRouteData = useRouteLoaderData<LoaderType>(
    'routes/books.$bookId',
  )

  if (!bookDetailsRouteData) return <div className="min-h-96" />

  const { work } = bookDetailsRouteData
  return (
    <div className="container">
      <div className="space-y-8">
        {/* ========== description ============== */}
        <div className="space-y-2">
          <p>
            <strong>Description:</strong>
          </p>
          <p className="text-sm leading-snug md:text-base md:leading-snug">
            {typeof work.description === 'string'
              ? work.description
              : work.description?.value}
          </p>
        </div>
        {/* ========== Subjects ============== */}
        <div className="space-y-4">
          <RendarSubjects
            subjectKeys={work.subject_key}
            subjects={work.subjects}
            type="subject"
            title="subjects"
          />
          <RendarSubjects
            subjectKeys={work.person_key}
            subjects={work.subject_people}
            type="person"
            title="People"
          />
          <RendarSubjects
            subjectKeys={work.place_key}
            subjects={work.subject_places}
            type="place"
            title="Places"
          />
          <RendarSubjects
            subjectKeys={work.time_key}
            subjects={work.subject_times}
            type="time"
            title="Times"
          />
        </div>
        <div></div>
      </div>
    </div>
  )
}

type SubjectType = 'subject' | 'place' | 'time' | 'person'
interface RendarSubjectsProps {
  subjects?: string[]
  subjectKeys?: string[]
  type: SubjectType
  title: string
}
function RendarSubjects({
  subjects = [],
  subjectKeys = [],
  type,
  title,
}: RendarSubjectsProps) {
  if (!subjects.length || !subjectKeys.length) return null

  const getLink = (id: string, type: SubjectType) => {
    switch (type) {
      case 'subject':
        return `/subjects/${id}`
      case 'person':
        return `/subjects/person:${id}`
      case 'place':
        return `/subjects/place:${id}`
      case 'time':
        return `/subjects/time:${id}`

      default:
        return ''
    }
  }

  return (
    <p className="text-xs md:text-sm">
      <strong className="uppercase">{title}:&nbsp;</strong>
      {subjectKeys.map((subjectKey, index) => (
        <span key={subjectKey + index}>
          <Link to={getLink(subjectKey, type)} className="underline">
            {subjects[index]}
          </Link>
          {subjectKeys.length - 1 !== index ? <>,&nbsp;&nbsp;</> : ''}
        </span>
      ))}
    </p>
  )
}
