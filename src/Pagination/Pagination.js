import React from 'react'
import PropTypes from 'prop-types'
import styled, {css} from 'styled-components'
import {get, COMMON} from '../constants'
import theme from '../theme'
import Box from '../Box'
import {buildPaginationModel, buildComponentData} from './model'

const Page = styled.a`
  position: relative;
  float: left;
  padding: 7px 12px;
  margin-left: -1px;
  font-size: 13px;
  font-style: normal;
  font-weight: ${get('pagination.fontWeight')};
  color: ${get('pagination.colors.normal.fg')};
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background: ${get('pagination.colors.normal.bg')};
  border: ${get('borders.1')} ${get('pagination.colors.normal.border')};
  text-decoration: none;

  &:first-child {
    margin-left: 0;
    border-top-left-radius: ${get('pagination.borderRadius')};
    border-bottom-left-radius: ${get('pagination.borderRadius')};
  }

  &:last-child {
    border-top-right-radius: ${get('pagination.borderRadius')};
    border-bottom-right-radius: ${get('pagination.borderRadius')};
  }

  ${props =>
    !props.selected &&
    !props.disabled &&
    css`
      &:hover,
      &:focus {
        z-index: 2;
        color: ${get('pagination.colors.hover.fg')};
        background-color: ${get('pagination.colors.hover.bg')};
        border-color: ${get('pagination.colors.hover.border')};
      }
    `}

  ${props =>
    props.selected &&
    css`
      z-index: 3;
      color: ${get('pagination.colors.selected.fg')};
      background-color: ${get('pagination.colors.selected.bg')};
      border-color: ${get('pagination.colors.selected.border')};
    `}

  ${props =>
    props.disabled &&
    css`
      color: ${get('pagination.colors.disabled.fg')};
      cursor: default;
      background-color: ${get('pagination.colors.disabled.bg')};
      border-color: ${get('pagination.colors.disabled.border')};
    `}

  ${COMMON};
`

function usePaginationPages({
  theme,
  pageCount,
  currentPage,
  onPageChange,
  hrefBuilder,
  marginPageCount,
  showPages,
  surroundingPageCount
}) {
  const pageChange = React.useCallback(n => e => onPageChange(e, n), [onPageChange])

  const model = React.useMemo(() => {
    return buildPaginationModel(pageCount, currentPage, showPages, marginPageCount, surroundingPageCount)
  }, [pageCount, currentPage, showPages, marginPageCount, surroundingPageCount])

  const children = React.useMemo(() => {
    return model.map(page => {
      const {props, key, content} = buildComponentData(page, hrefBuilder, pageChange(page.num))
      return (
        <Page {...props} key={key} theme={theme}>
          {content}
        </Page>
      )
    })
  }, [model, hrefBuilder, pageChange])

  return children
}

const PaginationContainer = styled.nav`
  margin-top: 20px;
  margin-bottom: 15px;
  text-align: center;
`

function Pagination({
  theme,
  pageCount,
  currentPage,
  onPageChange,
  hrefBuilder,
  marginPageCount,
  showPages,
  surroundingPageCount,
  ...rest
}) {
  const pageElements = usePaginationPages({
    theme,
    pageCount,
    currentPage,
    onPageChange,
    hrefBuilder,
    marginPageCount,
    showPages,
    surroundingPageCount
  })
  return (
    <PaginationContainer aria-label="Pagination" {...rest} theme={theme}>
      <Box display="inline-block" theme={theme}>
        {pageElements}
      </Box>
    </PaginationContainer>
  )
}

function defaultHrefBuilder(pageNum) {
  return `#${pageNum}`
}

function noop() {}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  hrefBuilder: PropTypes.func,
  marginPageCount: PropTypes.number,
  onPageChange: PropTypes.func,
  pageCount: PropTypes.number.isRequired,
  showPages: PropTypes.bool,
  surroundingPageCount: PropTypes.number
}

Pagination.defaultProps = {
  hrefBuilder: defaultHrefBuilder,
  marginPageCount: 1,
  onPageChange: noop,
  showPages: true,
  surroundingPageCount: 2,
  theme
}

export default Pagination
