import React from 'react'
import Box from '../Box'
import {buildComponentData, buildPaginationModel, type PageDataProps} from './model'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {clsx} from 'clsx'
import classes from './Pagination.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

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
  theme?: Record<string, unknown> // set to theme type once /src/theme.js is converted
  pageCount: number
  currentPage: number
  onPageChange: (e: React.MouseEvent, n: number) => void
  hrefBuilder: (n: number) => string
  marginPageCount: number
  showPages?: PaginationProps['showPages']
  surroundingPageCount: number
  renderPage?: (props: PageProps) => React.ReactNode
}

function usePaginationPages({
  theme,
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
        return renderPage({key, children: content, number: page.num, className: classes.Page, ...props})
      }

      return (
        // @ts-ignore giving me grief about children and "as" props
        <BoxWithFallback as="a" key={key} theme={theme} className={clsx(classes.Page)} {...props}>
          {content}
        </BoxWithFallback>
      )
    })
  }, [model, hrefBuilder, pageChange, renderPage, theme])

  return children
}

export type PaginationProps = {
  className?: string
  theme?: Record<string, unknown>
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
  theme: _theme,
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
    theme: _theme,
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
    <BoxWithFallback
      as="nav"
      className={clsx(classes.PaginationContainer, className)}
      aria-label="Pagination"
      {...rest}
    >
      <Box
        display="inline-block"
        className={classes.TablePaginationSteps}
        data-hidden-viewport-ranges={getViewportRangesToHidePages(showPages).join(' ')}
      >
        {pageElements}
      </Box>
    </BoxWithFallback>
  )
}

function defaultHrefBuilder(pageNum: number) {
  return `#${pageNum}`
}

function noop() {}

export default Pagination
