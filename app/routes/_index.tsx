import { SEOHandle } from '@nasa-gcn/remix-seo'
import type {
  MetaFunction,
  LoaderFunctionArgs,
  HeadersFunction,
} from '@remix-run/node'
import { json, Link, useLoaderData } from '@remix-run/react'
import Hero from '~/components/hero'
import Section from '~/components/section'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import WorkCard from '~/components/work-card'
import { getLanguages } from '~/lib/api/languages.server'
import { getWorksBySubject, popularSubjects } from '~/lib/api/subjects.server'
import { getTrendingWorks } from '~/lib/api/trending.server'

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
    getTrendingWorks({ type: 'daily', limit: 24 }),
    getTrendingWorks({ type: 'yearly', limit: 24 }),
    getLanguages({ limit: 15 }),
    getWorksBySubject({ subject: 'romance', limit: 24 }),
    getWorksBySubject({ subject: 'thrillers', limit: 24 }),
    getWorksBySubject({ subject: 'textbooks', limit: 24 }),
    getWorksBySubject({ subject: 'kids', limit: 24 }),
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
    { headers: { 'Cache-Control': 'public, max-age=3600, s-max-age=3600' } },
  )
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return { 'Cache-Control': loaderHeaders.get('Cache-Control') ?? '' }
}

export const handle: SEOHandle = {
  getSitemapEntries: () => [
    {
      route: '/',
      changefreq: 'daily',
      priority: 1.0,
    },
  ],
}

export const meta: MetaFunction = () => {
  return [
    { title: 'Tomeki - Search Millions of Books Instantly' },
    {
      name: 'description',
      content:
        "Explore Tomeki's vast collection of books across all genres. Search, discover, and dive into millions of books with ease. Find your next favorite read on Tomeki!",
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
      <Section className="my-10 lg:mb-14" title="Trending Today">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {trendingToday.map(({ title, key, coverId, authors, workId }) => (
            <WorkCard
              key={key}
              title={title}
              coverId={coverId}
              authors={authors}
              workId={workId}
            />
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Best of All Time">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {trendingAllTime.map(({ title, key, coverId, authors, workId }) => (
            <WorkCard
              key={key}
              title={title}
              coverId={coverId}
              authors={authors}
              workId={workId}
            />
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Browse by Subject">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {popularSubjects.map(({ title, id }) => (
            <Link
              to={`/subjects/${id}`}
              key={id}
              className="flex items-center rounded-md border px-4 py-6"
            >
              <span className="text-lg font-medium md:text-xl">{title}</span>
            </Link>
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Romance">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {romanceWorks.map(({ title, key, coverId, authors, workId }) => (
            <WorkCard
              key={key}
              title={title}
              coverId={coverId}
              authors={authors}
              workId={workId}
            />
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Thrillers">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {thrillerWorks.map(({ title, key, coverId, authors, workId }) => (
            <WorkCard
              key={key}
              title={title}
              coverId={coverId}
              authors={authors}
              workId={workId}
            />
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Textbooks">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {textbookWorks.map(({ title, key, coverId, authors, workId }) => (
            <WorkCard
              key={key}
              title={title}
              coverId={coverId}
              authors={authors}
              workId={workId}
            />
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Kids">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {kidsWorks.map(({ title, key, coverId, authors, workId }) => (
            <WorkCard
              key={key}
              title={title}
              coverId={coverId}
              authors={authors}
              workId={workId}
            />
          ))}
        </div>
      </Section>
      <Section className="my-10 lg:mb-14" title="Browse By Language">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {languages.map(({ title, langId, booksCount }) => (
            <Link
              to={`/languages/${langId}`}
              key={langId}
              className="flex flex-col justify-center rounded-md border px-4 py-6"
            >
              <span className="line-clamp-2 text-lg font-medium md:text-xl">
                {title}
              </span>
              <span>{booksCount.toLocaleString('en-US')} Books</span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  )
}
