import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, FLEX, get} from './constants'
import theme from './theme'

const SELECTED_CLASS = 'selected'

function BreadcrumbBase({className, children, theme, ...rest}) {
  const classes = classnames(className, 'Breadcrumb')
  const wrappedChildren = React.Children.map(children, child => <Breadcrumb.Wrapper>{child}</Breadcrumb.Wrapper>)
  return (
    <nav className={classes} aria-label="breadcrumb" {...rest}>
      <ol>{wrappedChildren}</ol>
    </nav>
  )
}

const Breadcrumb = styled(BreadcrumbBase)`
  display: flex;
  justify-content: space-between;
  ${COMMON};
  ${FLEX};
  & > ol {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }
`

Breadcrumb.Wrapper = styled.li`
  display: inline-block;
  white-space: nowrap;
  list-style: none;
  &::after {
    padding-right: 0.5em;
    padding-left: 0.5em;
    color: ${get('colors.gray.2')};
    font-size: ${get('fontSizes.1')};
    content: '/';
  }
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    &::after {
      content: none;
    }
  }
`

Breadcrumb.Item = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(props.selected && SELECTED_CLASS, props.className),
  'aria-current': props.selected ? 'page' : null
}))`
  color: ${get('colors.blue.5')};
  display: inline-block;
  font-size: ${get('fontSizes.1')};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &.selected {
    color: ${get('colors.gray.7')};
    pointer-events: none;
  }
  ${COMMON}
`

Breadcrumb.defaultProps = {
  theme
}

Breadcrumb.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

Breadcrumb.Item.defaultProps = {
  theme
}

Breadcrumb.Item.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes
}
Breadcrumb.Item.propTypes = {
  ...COMMON.propTypes
}

export default Breadcrumb
