import { useEffect, useState } from 'react'
import { useSearchParams } from '@remix-run/react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationButton,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import usePagination from '~/components/hooks/use-pagination'

interface PaginationWithControlProps {
  totalItems: number
  rowsPerPage?: number
}

function PaginationWithControl({
  totalItems,
  rowsPerPage = 20,
}: PaginationWithControlProps) {
  const [pageCount, setPageCount] = useState(0)
  const [searchParams, setSearchParams] = useSearchParams()

  const offset = Number(searchParams.get('offset')) || 0
  const currentPage = offset / rowsPerPage + 1

  const paginationRange = usePagination({
    currentPage,
    pageCount,
    siblingCount: 2,
  })

  const changePage = (newOffset: number) => {
    setSearchParams(prev => {
      if (newOffset < 1) prev.delete('offset')
      else prev.set('offset', `${newOffset}`)
      return prev
    })
  }

  useEffect(() => {
    setPageCount(Math.ceil(totalItems / rowsPerPage))
  }, [totalItems, rowsPerPage])
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={offset < 1}
            onClick={() => changePage(offset - rowsPerPage)}
          />
        </PaginationItem>
        {paginationRange.map((page, index) => (
          <PaginationItem
            key={`page-${page}-${index}`}
            className="hidden md:block"
          >
            {typeof page === 'string' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationButton
                isActive={currentPage === page}
                disabled={currentPage === page}
                className="disabled:opacity-100"
                onClick={() => changePage((page - 1) * rowsPerPage)}
              >
                {page}
              </PaginationButton>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => changePage(offset + rowsPerPage)}
            disabled={offset + rowsPerPage > totalItems}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export { PaginationWithControl as Pagination }
