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
  /**
   * Builds the URL for a page, so pagination works without JavaScript.
   * @default page => `#${page}`
   */
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
  'primer:mr-1 primer:inline-flex primer:h-8 primer:min-w-[var(--control-medium-size)] primer:cursor-pointer primer:select-none primer:items-center primer:justify-center primer:whitespace-nowrap primer:rounded-md primer:px-[6px] primer:py-2 primer:align-middle primer:text-center primer:leading-none primer:text-default primer:no-underline primer:transition-colors primer:duration-200 primer:last:mr-0 primer:hover:bg-[var(--control-transparent-bgColor-hover)] primer:hover:duration-100 primer:focus:bg-[var(--control-transparent-bgColor-hover)] primer:focus-visible:outline-2 primer:focus-visible:outline-offset-[-2px] primer:focus-visible:outline-[var(--bgColor-accent-emphasis)] primer:active:border-[var(--borderColor-muted)] primer:aria-[current=page]:border-transparent primer:aria-[current=page]:bg-accent-emphasis primer:aria-[current=page]:text-on-emphasis primer:aria-[current=page]:focus-visible:shadow-[inset_0_0_0_3px_var(--fgColor-onEmphasis)] primer:aria-disabled:pointer-events-none primer:aria-disabled:cursor-default primer:aria-disabled:bg-transparent primer:aria-disabled:text-disabled'

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
      className={cn('primer:mb-[15px] primer:mt-5 primer:text-center', className)}
      data-component={dataComponent}
    >
      {children}
      <div className="primer:inline-block">
        {pages.map(page => {
          const isEdge = page.type === 'previous' || page.type === 'next'
          const key = isEdge ? page.type : `${page.type}-${page.number}`
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
                    className="primer:mr-1 primer:size-[1em]"
                    data-component="Pagination.PreviousPageIcon"
                  />
                ) : null}
                {pageLabel}
                {page.type === 'next' ? (
                  <ChevronRightIcon
                    aria-hidden="true"
                    className="primer:ml-1 primer:size-[1em]"
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
            className: cn(pageClasses, isEdge && 'primer:text-accent', responsiveVisibility, previousPageSpacing),
          }
          if (renderPage) {
            return <React.Fragment key={key}>{renderPage(props)}</React.Fragment>
          }
          const {number, onPageSelect: _onPageSelect, pageType, ...anchorProps} = props
          void _onPageSelect
          return (
            <a
              {...anchorProps}
              key={key}
              data-component={
                isEdge ? `Pagination.${page.type === 'previous' ? 'PreviousPage' : 'NextPage'}` : 'Pagination.Page'
              }
              data-page={pageType}
              data-page-number={number}
            >
              {page.type === 'previous' ? (
                <ChevronLeftIcon
                  aria-hidden="true"
                  className="primer:mr-1 primer:size-[1em]"
                  data-component="Pagination.PreviousPageIcon"
                />
              ) : null}
              {pageLabel}
              {page.type === 'next' ? (
                <ChevronRightIcon
                  aria-hidden="true"
                  className="primer:ml-1 primer:size-[1em]"
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
