import {ChevronLeftIcon, ChevronRightIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {responsiveClasses} from '../../utils/responsive'
import type {ResponsiveValue} from '../../utils/types'
import {buildPaginationModel} from './model'

type PageType = 'previous' | 'next' | 'page' | 'ellipsis'

export interface PageProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  /** Page this link points at. */
  number: number
  /** Called when the page link is activated. */
  onPageSelect?: React.MouseEventHandler
  /** What the link represents: a numbered page, a previous or next step, or a gap in the range. */
  pageType: PageType
}
export interface PaginationProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** Overrides the marker used to identify this element in tests and styling. */
  'data-component'?: string
  /** Total number of pages. */
  pageCount: number
  /** Page currently being viewed, counting from one. */
  currentPage: number
  /** Called with the event and the requested page when a page is selected. */
  onPageChange?: (event: React.MouseEvent, page: number) => void
  /** Builds the URL for a page, so pagination works without JavaScript. */
  hrefBuilder?: (page: number) => string
  /** How many pages stay visible at each end of the range. */
  marginPageCount?: number
  /** Shows the numbered pages. Accepts a responsive object to hide them on narrow viewports. */
  showPages?: boolean | ResponsiveValue<boolean>
  /** How many pages stay visible on each side of the current one. */
  surroundingPageCount?: number
  /** Renders each page link yourself, for integrating with a router. */
  renderPage?: (props: PageProps) => React.ReactNode
}

const pageClasses =
  'mr-1 inline-flex h-8 min-w-[var(--control-medium-size)] cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-md px-[6px] py-2 align-middle text-center leading-none text-default no-underline transition-colors duration-200 last:mr-0 hover:bg-[var(--control-transparent-bgColor-hover)] hover:duration-100 focus:bg-[var(--control-transparent-bgColor-hover)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--bgColor-accent-emphasis)] aria-[current=page]:bg-accent-emphasis aria-[current=page]:text-on-emphasis aria-disabled:pointer-events-none aria-disabled:cursor-default aria-disabled:bg-transparent aria-disabled:text-disabled'

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    className,
    children,
    currentPage,
    hrefBuilder = defaultHrefBuilder,
    marginPageCount = 1,
    onPageChange,
    pageCount,
    renderPage,
    showPages = true,
    surroundingPageCount = 2,
    'aria-label': ariaLabel,
    'data-component': dataComponent = 'Pagination',
    ...rest
  },
  ref,
) {
  const shouldRenderPages = typeof showPages === 'boolean' ? showPages : true
  const pages = buildPaginationModel(pageCount, currentPage, shouldRenderPages, marginPageCount, surroundingPageCount)
  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={ariaLabel ?? 'Pagination'}
      className={cn('mb-[15px] mt-5 text-center', className)}
      data-component={dataComponent}
    >
      {children}
      <div className="inline-block">
        {pages.map(page => {
          const isEdge = page.type === 'previous' || page.type === 'next'
          const responsiveVisibility = isEdge
            ? ''
            : responsiveClasses(showPages, {true: 'inline-flex', false: 'hidden'}, true)
          const previousPageSpacing =
            page.type === 'previous' ? responsiveClasses(showPages, {true: 'mr-1', false: 'mr-0'}, true) : ''
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
                {page.type === 'previous' ? (
                  <ChevronLeftIcon
                    aria-hidden="true"
                    className="mr-1 size-[1em]"
                    data-component="Pagination.PreviousPageIcon"
                  />
                ) : null}
                {pageLabel}
                {page.type === 'next' ? (
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="ml-1 size-[1em]"
                    data-component="Pagination.NextPageIcon"
                  />
                ) : null}
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
            onPageSelect: page.disabled ? undefined : event => onPageChange?.(event, page.number),
            className: cn(pageClasses, isEdge && 'text-accent', responsiveVisibility, previousPageSpacing),
          }
          if (renderPage) {
            return <React.Fragment key={`${page.type}-${page.number}`}>{renderPage(props)}</React.Fragment>
          }
          const {number, onPageSelect: _onPageSelect, pageType, ...anchorProps} = props
          void _onPageSelect
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
              {page.type === 'previous' ? (
                <ChevronLeftIcon
                  aria-hidden="true"
                  className="mr-1 size-[1em]"
                  data-component="Pagination.PreviousPageIcon"
                />
              ) : null}
              {pageLabel}
              {page.type === 'next' ? (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="ml-1 size-[1em]"
                  data-component="Pagination.NextPageIcon"
                />
              ) : null}
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
