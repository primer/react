import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import sx from '../sx'
import {buildComponentData, buildPaginationModel} from './model'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {viewportRanges} from '../hooks/useResponsiveValue'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {useFeatureFlag} from '../FeatureFlags'
import {clsx} from 'clsx'
import classes from './Pagination.module.css'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

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

const Page = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'a',
  styled.a`
    display: inline-block;
    min-width: 32px; /* primer.control.medium.size */
    height: 32px; /* primer.control.medium.size */
    padding: 0.5rem calc((2rem - 1.25rem) / 2); /* primer.control.medium.paddingInline.condensed primer.control.medium.paddingBlock */
    font-style: normal;
    line-height: 1;
    color: ${get('colors.fg.default')};
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    text-decoration: none;

    margin-right: ${get('space.1')};

    &:last-child {
      margin-right: 0;
    }

    background-color: transparent;
    border-radius: ${get('radii.2')};
    transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);

    &:hover,
    &:focus {
      text-decoration: none;
      background-color: ${get('colors.actionListItem.default.hoverBg')};
      outline: 0;
      transition-duration: 0.1s;
    }

    &:focus-visible {
      outline: 2px solid ${get('colors.accent.emphasis')};
      outline-offset: -2px;
    }

    &:active {
      border-color: ${get('colors.border.muted')};
    }

    &[rel='prev'],
    &[rel='next'] {
      color: ${get('colors.accent.fg')};
    }

    &[aria-current],
    &[aria-current]:hover {
      color: ${get('colors.fg.onEmphasis')};
      background-color: ${get('colors.accent.emphasis')};
      border-color: transparent;
    }

    &[aria-current]:focus-visible {
      outline: 2px solid ${get('colors.accent.emphasis')};
      outline-offset: -2px;
      box-shadow: inset 0 0 0 3px ${get('colors.fg.onEmphasis')};
    }

    &[aria-hidden],
    &[aria-hidden]:hover,
    &[role='presentation'],
    &[role='presentation']:hover {
      color: ${get('colors.primer.fg.disabled')}; // check
      cursor: default;
      background-color: transparent;
    }

    @supports (clip-path: polygon(50% 0, 100% 50%, 50% 100%)) {
      &[rel='prev']::before,
      &[rel='next']::after {
        display: inline-block;
        width: 16px;
        height: 16px;
        vertical-align: text-bottom;
        content: '';
        background-color: currentColor;
      }

      // chevron-left
      &[rel='prev']::before {
        margin-right: ${get('space.1')};
        clip-path: polygon(
          9.8px 12.8px,
          8.7px 12.8px,
          4.5px 8.5px,
          4.5px 7.5px,
          8.7px 3.2px,
          9.8px 4.3px,
          6.1px 8px,
          9.8px 11.7px,
          9.8px 12.8px
        );
      }

      // chevron-right
      &[rel='next']::after {
        margin-left: ${get('space.1')};
        clip-path: polygon(
          6.2px 3.2px,
          7.3px 3.2px,
          11.5px 7.5px,
          11.5px 8.5px,
          7.3px 12.8px,
          6.2px 11.7px,
          9.9px 8px,
          6.2px 4.3px,
          6.2px 3.2px
        );
      }
    }
  `,
)

type UsePaginationPagesParameters = {
  theme?: Record<string, unknown> // set to theme type once /src/theme.js is converted
  pageCount: number
  currentPage: number
  onPageChange: (e: React.MouseEvent, n: number) => void
  hrefBuilder: (n: number) => string
  marginPageCount: number
  showPages?: PaginationProps['showPages']
  surroundingPageCount: number
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
}: UsePaginationPagesParameters) {
  const pageChange = React.useCallback((n: number) => (e: React.MouseEvent) => onPageChange(e, n), [onPageChange])

  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  const model = React.useMemo(() => {
    return buildPaginationModel(pageCount, currentPage, !!showPages, marginPageCount, surroundingPageCount)
  }, [pageCount, currentPage, showPages, marginPageCount, surroundingPageCount])

  const children = React.useMemo(() => {
    return model.map(page => {
      const {props, key, content} = buildComponentData(page, hrefBuilder, pageChange(page.num))
      return (
        <Page {...props} key={key} theme={theme} className={clsx(enabled && classes.Page)}>
          {content}
        </Page>
      )
    })
  }, [model, hrefBuilder, pageChange, theme, enabled])

  return children
}

const PaginationContainer = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'nav',
  styled.nav<SxProp>`
    margin-top: 20px;
    margin-bottom: 15px;
    text-align: center;

    ${
      // Hides pages based on the viewport range passed to `showPages`
      Object.keys(viewportRanges)
        .map(viewportRangeKey => {
          return `
      @media (${viewportRanges[viewportRangeKey as keyof typeof viewportRanges]}) {
        .TablePaginationSteps[data-hidden-viewport-ranges*='${viewportRangeKey}'] > *:not(:first-child):not(:last-child) {
          display: none;
        }

        .TablePaginationSteps[data-hidden-viewport-ranges*='${viewportRangeKey}'] > *:first-child {
          margin-inline-end: 0;
        }

        .TablePaginationSteps[data-hidden-viewport-ranges*='${viewportRangeKey}'] > *:last-child {
          margin-inline-start: 0;
        }
      }
    `
        })
        .join('')
    }

    ${sx};
  `,
)

export type PaginationProps = {
  theme?: Record<string, unknown>
  pageCount: number
  currentPage: number
  onPageChange?: (e: React.MouseEvent, n: number) => void
  hrefBuilder?: (n: number) => string
  marginPageCount?: number
  showPages?: boolean | ResponsiveValue<boolean>
  surroundingPageCount?: number
}

function Pagination({
  theme,
  pageCount,
  currentPage,
  onPageChange = noop,
  hrefBuilder = defaultHrefBuilder,
  marginPageCount = 1,
  showPages = true,
  surroundingPageCount = 2,
  ...rest
}: PaginationProps) {
  const pageElements = usePaginationPages({
    theme,
    pageCount,
    currentPage,
    onPageChange,
    hrefBuilder,
    marginPageCount,
    showPages,
    surroundingPageCount,
  })

  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  return (
    <PaginationContainer
      className={clsx(enabled && classes.PaginationContainer)}
      aria-label="Pagination"
      {...rest}
      theme={theme}
    >
      <Box
        display="inline-block"
        theme={theme}
        className={classes.TablePaginationSteps}
        data-hidden-viewport-ranges={getViewportRangesToHidePages(showPages).join(' ')}
      >
        {pageElements}
      </Box>
    </PaginationContainer>
  )
}

function defaultHrefBuilder(pageNum: number) {
  return `#${pageNum}`
}

function noop() {}

export default Pagination
