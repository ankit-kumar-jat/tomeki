import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json, useLoaderData } from '@remix-run/react'
import Hero from '~/components/hero'
import Section from '~/components/section'
import { getLanguages } from '~/lib/api.server/languages'
import { getWorksBySubject, popularSubjects } from '~/lib/api.server/subjects'
import { getTrendingWorks } from '~/lib/api.server/trending'

export async function loader({ request }: LoaderFunctionArgs) {
  const [
    trendingToday,
    trendingAllTime,
    languages,
    { works: romanceWorks },
    { works: thrillerWorks },
    { works: textbookWorks },
    { works: kidsWorks },
  ] = await Promise.all([
    getTrendingWorks({ type: 'daily', limit: 20 }),
    getTrendingWorks({ type: 'yearly', limit: 20 }),
    getLanguages({ limit: 20 }),
    getWorksBySubject({ subject: 'romance', limit: 20 }),
    getWorksBySubject({ subject: 'thrillers', limit: 20 }),
    getWorksBySubject({ subject: 'textbooks', limit: 20 }),
    getWorksBySubject({ subject: 'kids', limit: 20 }),
  ])

  return json(
    {
      trendingToday,
      trendingAllTime,
      popularSubjects,
      languages,
      romanceWorks,
      thrillerWorks,
      textbookWorks,
      kidsWorks,
    },
    { headers: { 'Cache-Control': 'public, max-age=3600' } },
  )
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Novalla - Search Millions of Books Instantly' },
    {
      name: 'description',
      content:
        "Explore Novalla's vast collection of books across all genres. Search, discover, and dive into millions of books with ease. Find your next favorite read on Novalla!",
    },
  ]
}

export default function Index() {
  const {
    trendingToday,
    trendingAllTime,
    popularSubjects,
    languages,
    romanceWorks,
    thrillerWorks,
    textbookWorks,
    kidsWorks,
  } = useLoaderData<typeof loader>()

  return (
    <div className="container">
      <Hero />
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Trending Today">
        {trendingToday.map(({ title, key }) => (
          <p key={key}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Best of All Time">
        {trendingAllTime.map(({ title, key }) => (
          <p key={key}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Browse by Subject">
        {popularSubjects.map(({ title, id }) => (
          <p key={id}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Romance">
        {romanceWorks.map(({ title, key }) => (
          <p key={key}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Thrillers">
        {thrillerWorks.map(({ title, key }) => (
          <p key={key}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Textbooks">
        {textbookWorks.map(({ title, key }) => (
          <p key={key}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Kids">
        {kidsWorks.map(({ title, key }) => (
          <p key={key}>{title}</p>
        ))}
      </Section>
      <Section className="mb-6 md:mb-8 lg:mb-10" title="Browse By Language">
        {languages.map(({ title, langId, booksCount }) => (
          <p key={langId}>
            {title} - <span>{booksCount} Books</span>
          </p>
        ))}
      </Section>
    </div>
  )
}
