import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, FLEX, get} from './constants'
import theme from './theme'

const ITEM_CLASS = 'Breadcrumb-item'
const SELECTED_CLASS = 'selected'

function BreadcrumbBase({className, children, label, separator, ...rest}) {
  const classes = classnames(className, 'Breadcrumb')
  const wrappedChildren = React.Children.map(children, (child) => <Breadcrumb.Wrapper separator={separator}>{child}</Breadcrumb.Wrapper>)
  return (
    <nav className={classes} aria-label={label} {...rest}>
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

Breadcrumb.Wrapper= styled.li.attrs(({separator}) => ({
  className: classnames(ITEM_CLASS),
  separator
}))`
  display: inline-block;
  white-space: nowrap;
  list-style: none;
  &::after {
    padding-right: ${get('space.1')};
    padding-left: ${get('space.1')};
    color: ${get('colors.gray.2')};
    font-size: ${get('fontSizes.0')};
    content: "${props => props.separator}";
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
  className: classnames(props.selected && SELECTED_CLASS, props.className)
}))`
  display: inline-block;
  font-size: ${get('fontSizes.0')};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &.selected {
    color: ${get('colors.gray.7')};
    pointer-events: none;
  }
`

Breadcrumb.defaultProps = {
  theme,
  separator: '/'
}

Breadcrumb.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string,
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
