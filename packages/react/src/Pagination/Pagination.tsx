import React from 'react'
import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import {buildComponentData, buildPaginationModel, type PageDataProps} from './model'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {clsx} from 'clsx'
import classes from './Pagination.module.css'

const getViewportRangesToHidePages = (showPages: PaginationProps['showPages']) => {
  if (showPages && typeof showPages !== 'boolean') {
    return Object.keys(showPages).filter(key => !showPages[key as keyof typeof viewportRanges]) as Array<
      keyof typeof viewportRanges
    >
  }

  if (showPages) {
    return []
  } else {
    return Object.keys(viewportRanges) as Array<keyof typeof viewportRanges>
  }
}

export type PageProps = {
  /* Unique key for the page number */
  key: string
  /* Children to render, typically the page number, 'Prev', or 'Next' */
  children: React.ReactNode
  /* Page number */
  number: number
  /* Default styles for the page number */
  className: string
} & Omit<PageDataProps['props'], 'as' | 'role'>

type UsePaginationPagesParameters = {
  pageCount: number
  currentPage: number
  onPageChange: (e: React.MouseEvent, n: number) => void
  hrefBuilder: (n: number) => string
  marginPageCount: number
  showPages?: PaginationProps['showPages']
  surroundingPageCount: number
  renderPage?: (props: PageProps) => React.ReactNode
}

type PageLabelProps = {
  children: React.ReactNode
  direction?: PageProps['key']
}

const PageLabel = ({children, direction}: PageLabelProps) => (
  <>
    {direction === 'page-prev' ? <ChevronLeftIcon /> : null}
    {children}
    {direction === 'page-next' ? <ChevronRightIcon /> : null}
  </>
)

function usePaginationPages({
  pageCount,
  currentPage,
  onPageChange,
  hrefBuilder,
  marginPageCount,
  showPages,
  surroundingPageCount,
  renderPage,
}: UsePaginationPagesParameters) {
  const pageChange = React.useCallback((n: number) => (e: React.MouseEvent) => onPageChange(e, n), [onPageChange])

  const model = React.useMemo(() => {
    return buildPaginationModel(pageCount, currentPage, !!showPages, marginPageCount, surroundingPageCount)
  }, [pageCount, currentPage, showPages, marginPageCount, surroundingPageCount])

  const children = React.useMemo(() => {
    return model.map(page => {
      const {props, key, content} = buildComponentData(page, hrefBuilder, pageChange(page.num))
      if (renderPage && props.as !== 'span') {
        return renderPage({
          key,
          children: <PageLabel direction={key}>{content}</PageLabel>,
          number: page.num,
          className: classes.Page,
          ...props,
        })
      }
      const Component = props.as || 'a'

      return (
        // @ts-ignore giving me grief about children and "as" props
        <Component {...props} key={key} className={clsx(classes.Page)}>
          <PageLabel direction={key}>{content}</PageLabel>
        </Component>
      )
    })
  }, [model, hrefBuilder, pageChange, renderPage])

  return children
}

export type PaginationProps = {
  className?: string
  pageCount: number
  currentPage: number
  onPageChange?: (e: React.MouseEvent, n: number) => void
  hrefBuilder?: (n: number) => string
  marginPageCount?: number
  showPages?: boolean | ResponsiveValue<boolean>
  surroundingPageCount?: number
  renderPage?: (props: PageProps) => React.ReactNode
}

function Pagination({
  className,
  pageCount,
  currentPage,
  onPageChange = noop,
  hrefBuilder = defaultHrefBuilder,
  marginPageCount = 1,
  showPages = true,
  surroundingPageCount = 2,
  renderPage,
  ...rest
}: PaginationProps) {
  const pageElements = usePaginationPages({
    pageCount,
    currentPage,
    onPageChange,
    hrefBuilder,
    marginPageCount,
    showPages,
    surroundingPageCount,
    renderPage,
  })

  return (
    <nav {...rest} className={clsx(classes.PaginationContainer, className)} aria-label="Pagination">
      <div
        className={classes.TablePaginationSteps}
        data-hidden-viewport-ranges={getViewportRangesToHidePages(showPages).join(' ')}
      >
        {pageElements}
      </div>
    </nav>
  )
}

function defaultHrefBuilder(pageNum: number) {
  return `#${pageNum}`
}

function noop() {}

export default Pagination
