import type { LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, useSearchParams } from '@remix-run/react'
import { StarIcon } from 'lucide-react'
import { AdsterraHorizontalAdsBanner } from '~/components/adsterra/horizontal-ads-banner'
import { AdsterraNativeAdsBanner } from '~/components/adsterra/native-ads-banner'
import { Pagination } from '~/components/pagination'
import SearchForm from '~/components/search-form'
import { searchWorks, searchWorksSortValues } from '~/lib/api.server/search'
import { getCoverImage, isIn } from '~/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  const offset = Number(url.searchParams.get('offset')) || 0
  const sort = url.searchParams.get('sort') ?? ''

  if (!q) {
    return {
      numFound: 0,
      foundExact: false,
      works: [],
    }
  }

  const searchRes = await searchWorks({
    q,
    offset,
    sort: isIn(searchWorksSortValues, sort) ? sort : undefined,
    fields: [
      'title',
      'key',
      'cover_i',
      'author_name',
      'edition_count',
      'want_to_read_count',
      'already_read_count',
      'ratings_average',
      'ratings_count',
      'first_publish_year',
    ],
  })

  return {
    numFound: searchRes?.numFound ?? searchRes?.num_found ?? 0,
    foundExact: searchRes?.numFoundExact ?? false,
    works: searchRes?.docs?.length ? searchRes.docs : [],
  }
}

export default function Index() {
  const { numFound, foundExact, works } = useLoaderData<typeof loader>()

  return (
    <div className="grid lg:grid-cols-12">
      <div className="lg:col-span-7">
        <SearchForm />
        <div className="mt-4 min-h-60 space-y-4 lg:mt-6">
          {numFound !== 0 ? (
            <>
              <div className="flex flex-nowrap justify-between gap-4 text-xs md:text-sm">
                <p>
                  {numFound.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}{' '}
                  Results
                </p>
                <div className="whitespace-nowrap">
                  <SortDropdown />
                </div>
              </div>
              <div className="space-y-2">
                {works.map(work => (
                  <WorkCard
                    key={work.key}
                    title={work.title}
                    coverId={work.cover_i}
                    workPath={`/books/${work.key.split('/').pop()}`}
                    firstPublishYear={work.first_publish_year}
                    editionCount={work.edition_count}
                    ratingsCount={work.ratings_count ?? 0}
                    avgRating={work.ratings_average?.toFixed(2) ?? '0'}
                    authors={work.author_name?.toString() ?? ''}
                  />
                ))}
              </div>
              <div className="flex justify-center">
                <Pagination totalItems={numFound} />
              </div>
            </>
          ) : (
            <NoResults />
          )}
        </div>
        <div>
          <AdsterraHorizontalAdsBanner />
          <AdsterraNativeAdsBanner />
        </div>
      </div>
      <div className="lg:col-span-5">
        {/* This can be used to display ads */}
      </div>
    </div>
  )
}

function SortDropdown() {
  const [searchParams, setSearchParams] = useSearchParams()
  const sortBy = searchParams.get('sort') ?? 'relevance'

  const changeSortBy = (newSortBy: string) => {
    setSearchParams(prev => {
      if (newSortBy === 'relevance') prev.delete('sort')
      else prev.set('sort', newSortBy)
      return prev
    })
  }

  return (
    <Select defaultValue={sortBy} onValueChange={changeSortBy}>
      <SelectTrigger className="h-6 border-none p-0 text-xs md:text-sm">
        SortBy:&nbsp;
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="editions">Most Editions</SelectItem>
          <SelectItem value="old">First Published</SelectItem>
          <SelectItem value="new">Most Recent</SelectItem>
          <SelectItem value="rating">Top Rated</SelectItem>
          <SelectItem value="readinglog">Reading Log</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

interface WorkCardProps {
  title: string
  workPath: string
  coverId?: number
  firstPublishYear: number
  editionCount: number
  ratingsCount: number
  avgRating: string
  authors: string
}

function WorkCard({
  title,
  coverId,
  workPath,
  firstPublishYear,
  editionCount,
  ratingsCount,
  avgRating,
  authors,
}: WorkCardProps) {
  return (
    <div className="flex border">
      <div className="relative flex-shrink-0 border">
        {coverId ? (
          <img
            src={getCoverImage({
              type: 'id',
              size: 'M',
              id: coverId,
            })}
            alt={`Cover of ${title}`}
            width={112}
            height={198}
            className="aspect-[2/3] h-auto w-28 object-cover"
          />
        ) : (
          <div className="flex aspect-[2/3] h-auto w-28 bg-muted p-2">
            <div className="flex w-full items-center justify-center border-4 border-white">
              <p className="line-clamp-6 text-center capitalize text-muted-foreground">
                {title}
              </p>
            </div>
          </div>
        )}
        <Link to={workPath} className="absolute inset-0">
          <span className="sr-only">View {title}</span>
        </Link>
      </div>
      <div className="flex flex-col justify-between px-3 py-2">
        <div>
          <Link
            to={workPath}
            className="line-clamp-2 text-base sm:text-lg md:text-xl"
          >
            {title}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground md:text-base">
            By {authors}
          </p>
          <p className="mt-1 text-xs md:text-sm">
            First Published in {firstPublishYear}
          </p>
        </div>
        <div className="space-y-1">
          <p className="flex gap-1 text-sm md:text-base">
            <StarIcon width={20} fill="currentColor" />
            <span>{avgRating}</span>
            <span>({ratingsCount} ratings)</span>
          </p>
          <p className="text-sm md:text-base">
            <span>{editionCount} </span>
            <span className="text-xs md:text-sm">Editions</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function NoResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  return (
    <p className="text-center">
      {query
        ? 'No books directly matched your search'
        : 'Start typing to search for books...'}
    </p>
  )
}
