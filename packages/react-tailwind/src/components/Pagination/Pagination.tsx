import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {responsiveClasses, type ResponsiveValue} from '../Stack/responsive'
import {buildPaginationModel} from './model'

type PageType = 'previous' | 'next' | 'page' | 'ellipsis'

export interface PageProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  number: number
  pageType: PageType
}
export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  pageCount: number
  currentPage: number
  onPageChange?: (event: React.MouseEvent, page: number) => void
  hrefBuilder?: (page: number) => string
  marginPageCount?: number
  showPages?: boolean | ResponsiveValue<boolean>
  surroundingPageCount?: number
  renderPage?: (props: PageProps) => React.ReactNode
}

const pageClasses =
  'inline-flex h-8 min-w-[var(--control-medium-size)] items-center justify-center rounded-md px-1 text-center text-sm text-default no-underline hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus aria-[current=page]:bg-accent-emphasis aria-[current=page]:text-on-emphasis aria-disabled:pointer-events-none aria-disabled:text-disabled'

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    className,
    currentPage,
    hrefBuilder = defaultHrefBuilder,
    marginPageCount = 1,
    onPageChange,
    pageCount,
    renderPage,
    showPages = true,
    surroundingPageCount = 2,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const shouldRenderPages =
    typeof showPages === 'boolean' ? showPages : Object.values(showPages).some(viewportValue => viewportValue === true)
  const pages = buildPaginationModel(pageCount, currentPage, shouldRenderPages, marginPageCount, surroundingPageCount)
  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={ariaLabel ?? 'Pagination'}
      className={cn('my-4 text-center', className)}
      data-component="Pagination"
    >
      <div className="inline-flex items-center gap-1">
        {pages.map(page => {
          const isEdge = page.type === 'previous' || page.type === 'next'
          const responsiveVisibility = isEdge
            ? ''
            : responsiveClasses(showPages, {true: 'inline-flex', false: 'hidden'}, true)
          const pageLabel =
            page.type === 'previous'
              ? 'Previous'
              : page.type === 'next'
                ? 'Next'
                : page.type === 'ellipsis'
                  ? '…'
                  : String(page.number)
          if (page.type === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${page.number}`}
                className={cn(pageClasses, responsiveVisibility)}
                role="presentation"
              >
                …
              </span>
            )
          }
          const props: PageProps = {
            children: (
              <>
                {page.type === 'previous' ? <ChevronLeftIcon aria-hidden="true" /> : null}
                {pageLabel}
                {page.type === 'next' ? <ChevronRightIcon aria-hidden="true" /> : null}
              </>
            ),
            number: page.number,
            pageType: page.type,
            href: page.disabled ? undefined : hrefBuilder(page.number),
            rel: page.type === 'previous' ? 'prev' : page.type === 'next' ? 'next' : undefined,
            'aria-current': page.selected ? 'page' : undefined,
            'aria-disabled': page.disabled || undefined,
            'aria-label':
              page.type === 'page' ? `Page ${page.number}${page.precedesBreak ? '...' : ''}` : `${pageLabel} page`,
            onClick: page.disabled ? undefined : event => onPageChange?.(event, page.number),
            className: cn(pageClasses, isEdge && 'text-accent', responsiveVisibility),
          }
          if (renderPage) {
            return <React.Fragment key={`${page.type}-${page.number}`}>{renderPage(props)}</React.Fragment>
          }
          const {number, pageType, ...anchorProps} = props
          return (
            <a
              {...anchorProps}
              key={`${page.type}-${page.number}`}
              data-component={
                isEdge ? `Pagination.${page.type === 'previous' ? 'PreviousPage' : 'NextPage'}` : 'Pagination.Page'
              }
              data-page={pageType}
              data-page-number={number}
            >
              {page.type === 'previous' ? <ChevronLeftIcon aria-hidden="true" /> : null}
              {pageLabel}
              {page.type === 'next' ? <ChevronRightIcon aria-hidden="true" /> : null}
            </a>
          )
        })}
      </div>
    </nav>
  )
})
Pagination.displayName = 'Pagination'
function defaultHrefBuilder(page: number) {
  return `#${page}`
}
