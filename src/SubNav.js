import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, FLEX, get} from './constants'
import theme from './theme'
import Flex from './Flex'
import sx from './sx'

const ITEM_CLASS = 'SubNav-item'
const SELECTED_CLASS = 'selected'

function SubNavBase({actions, className, children, label, theme, ...rest}) {
  const classes = classnames(className, 'SubNav')
  return (
    <nav className={classes} aria-label={label} {...rest}>
      <div className="SubNav-body">{children}</div>
      {actions && <div className="SubNav-actions">{actions}</div>}
    </nav>
  )
}

const SubNav = styled(SubNavBase)`
  display: flex;
  justify-content: space-between;

  .SubNav-body {
    display: flex;
    margin-bottom: -1px;

    > * {
      margin-left: ${get('space.2')};
    }

    > *:first-child {
      margin-left: 0;
    }
  }

  .SubNav-actions {
    align-self: center;
  }

  ${COMMON};
  ${FLEX};
  ${sx};
`

SubNav.Links = (props) => <Flex {...props} />

SubNav.Link = styled.a.attrs((props) => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
}))`
  padding-left: ${get('space.3')};
  padding-right: ${get('space.3')};
  font-weight: ${get('fontWeights.semibold')};
  font-size: ${get('fontSizes.1')};
  line-height: 20px; //custom value for SubNav
  min-height: 34px; //custom value for SubNav
  color: ${get('colors.gray.9')};
  text-align: center;
  text-decoration: none;
  border-top: 1px solid ${get('colors.gray.2')};
  border-bottom: 1px solid ${get('colors.gray.2')};
  border-right: 1px solid ${get('colors.gray.2')};
  display: flex;
  align-items: center;

  &:first-of-type {
    border-top-left-radius: ${get('radii.2')};
    border-bottom-left-radius: ${get('radii.2')};
    border-left: 1px solid ${get('colors.gray.2')};
  }

  &:last-of-type {
    border-top-right-radius: ${get('radii.2')};
    border-bottom-right-radius: ${get('radii.2')};
  }

  &:hover,
  &:focus {
    text-decoration: none;
    background-color: ${get('colors.gray.1')};
    transition: 0.2s ease;

    .SubNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  &.selected {
    color: ${get('colors.white')};
    background-color: ${get('colors.blue.5')};
    border: 0;
    .SubNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  ${COMMON};
  ${sx};
`

SubNav.defaultProps = {
  theme,
}

SubNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...sx.propTypes,
}

SubNav.Link.defaultProps = {
  theme,
}

SubNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes,
  ...sx.propTypes,
}
SubNav.Link.displayName = 'SubNav.Link'

SubNav.Links.propTypes = {
  ...Flex.propTypes,
}
SubNav.Links.displayName = 'SubNav.Links'

export default SubNav
