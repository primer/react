import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
// import classnames from 'classnames'
import {get} from '../constants'
// import theme from '../theme'
// import elementType from './utils/elementType'
// import Link from './Link'
import Box from '../Box'
import {buildPaginationModel} from './model'

const Page = styled.a`
  position: relative;
  float: left;
  padding: 7px 12px;
  margin-left: -1px;
  font-size: 13px;
  font-style: normal;
  font-weight: ${get('fontWeights.bold')};
  color: ${get('blue.5')};
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background: ${get('white')};
  border: ${get('borders.1')} ${get('colors.border.gray')};
`

function buildPaginationModelComponent(page, hrefBuilder, ariaLabelBuilder, onClick) {
  const props = {}
  let content = ''
  let key = ''

  switch (page.type) {
    case 'PREV': {
      key = 'page-prev'
      content = 'Previous'
      if (page.disabled) {
        Object.assign(props, {as: 'span', 'aria-disabled': 'true'})
      } else {
        Object.assign(props, {
          rel: 'prev',
          href: hrefBuilder(page.num),
          'aria-label': 'Previous Page',
          onClick
        })
      }
      break
    }
    case 'NEXT': {
      key = 'page-next'
      content = 'Next'
      if (page.disabled) {
        Object.assign(props, {as: 'span', 'aria-disabled': 'true'})
      } else {
        Object.assign(props, {
          rel: 'next',
          href: hrefBuilder(page.num),
          'aria-label': 'Next Page',
          onClick
        })
      }
      break
    }
    case 'NUM': {
      key = `page-${page.num}`
      content = page.num
      if (page.selected) {
        Object.assign(props, {as: 'em', 'aria-current': 'page'})
      } else {
        Object.assign(props, {href: hrefBuilder(page.num), 'aria-label': ariaLabelBuilder(page.num), onClick})
      }
      break
    }
    case 'BREAK': {
      key = `page-${page.num}-break`
      content = '…'
      Object.assign(props, {as: 'span'})
    }
  }

  return (
    <Page {...props} key={key}>
      {content}
    </Page>
  )
}

function usePaginationPages({
  pages,
  currentPage,
  onPageChange,
  hrefBuilder,
  ariaLabelBuilder,
  marginPageCount,
  showPages,
  surroundingPageCount
}) {
  const pageChange = React.useCallback(n => e => onPageChange(e, n), [onPageChange])

  const model = React.useMemo(() => {
    return buildPaginationModel(pages, currentPage, showPages, marginPageCount, surroundingPageCount)
  }, [pages, currentPage, showPages, marginPageCount, surroundingPageCount])

  const children = React.useMemo(() => {
    return model.map(page => buildPaginationModelComponent(page, hrefBuilder, ariaLabelBuilder, pageChange(page.num)))
  }, [model, hrefBuilder, ariaLabelBuilder, pageChange])

  return children
}

const PaginationContainer = styled.nav`
  margin-top: 20px;
  margin-bottom: 15px;
  text-align: center;
`

function Pagination({
  theme,
  pages,
  currentPage,
  onPageChange,
  hrefBuilder,
  ariaLabelBuilder,
  marginPageCount,
  showPages,
  surroundingPageCount,
  ...rest
}) {
  const pageElements = usePaginationPages({
    pages,
    currentPage,
    onPageChange,
    hrefBuilder,
    ariaLabelBuilder,
    marginPageCount,
    showPages,
    surroundingPageCount
  })
  return (
    <PaginationContainer aria-label="Pagination" {...rest}>
      <Box display="inline-block">{pageElements}</Box>
    </PaginationContainer>
  )
}

function defaultAriaLabelBuilder(pageNum) {
  return `Page ${pageNum}`
}

function defaultHrefBuilder(pageNum) {
  return `#${pageNum}`
}

function noop() {}

Pagination.propTypes = {
  ariaLabelBuilder: PropTypes.func,
  currentPage: PropTypes.number.isRequired,
  hrefBuilder: PropTypes.func,
  marginPageCount: PropTypes.number,
  onPageChange: PropTypes.func,
  pages: PropTypes.number.isRequired,
  showPages: PropTypes.bool,
  surroundingPageCount: PropTypes.number
}

Pagination.defaultProps = {
  ariaLabelBuilder: defaultAriaLabelBuilder,
  hrefBuilder: defaultHrefBuilder,
  marginPageCount: 1,
  onPageChange: noop,
  showPages: true,
  surroundingPageCount: 2
}

export default Pagination
