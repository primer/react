import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import sx from './sx'
import {COMMON, FLEX, get} from './constants'
import theme from './theme'
import Box from './Box'

const SELECTED_CLASS = 'selected'

const Wrapper = styled.li`
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

const BreadcrumbBase = ({className, children, theme, ...rest}) => {
  const classes = classnames(className, 'Breadcrumb')
  const wrappedChildren = React.Children.map(children, (child) => <Wrapper theme={theme}>{child}</Wrapper>)
  return (
    <nav className={classes} aria-label="breadcrumb" {...rest}>
      <Box as="ol" my={0} pl={0}>
        {wrappedChildren}
      </Box>
    </nav>
  )
}

const Breadcrumb = styled(BreadcrumbBase)`
  display: flex;
  justify-content: space-between;
  ${COMMON};
  ${FLEX};
  ${sx};
`

Breadcrumb.Item = styled.a.attrs((props) => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(props.selected && SELECTED_CLASS, props.className),
  'aria-current': props.selected ? 'page' : null,
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
  ${sx};
`

Breadcrumb.defaultProps = {
  theme,
}

Breadcrumb.propTypes = {
  ...COMMON.propTypes,
  ...sx.propTypes,
}

Breadcrumb.displayName = 'Breadcrumb'

Breadcrumb.Item.defaultProps = {
  theme,
}

Breadcrumb.Item.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...sx.propTypes,
  ...COMMON.propTypes,
}

Breadcrumb.Item.displayName = 'Breadcrumb.Item'

export default Breadcrumb
