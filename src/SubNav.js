import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

const ITEM_CLASS = 'SubNav-item'
const SELECTED_CLASS = 'selected'

function SubNavBase({actions, className, align, children, full, label, ...rest}) {
  const classes = classnames(className, 'SubNav', align && `SubNav--${align}`, full && 'SubNav--full')
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

  &.SubNav--right {
    justify-content: flex-end;

    .SubNav-item {
      margin-right: 0;
      margin-left: ${get('space.3')}px;
    }

    .SubNav-actions {
      flex: 1 1 auto;
    }
  }
  &.SubNav--full {
    display: block;
  }

  .SubNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  .SubNav-actions {
    align-self: center;
  }

  ${COMMON};
`

SubNav.Link = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))`
  padding-left: ${get('space.3')}px;
  padding-right: ${get('space.3')}px;
  min-height: 34px; // copied from TextInput, but should be a variable.
  font-weight: ${get('fontWeights.bold')};
  font-size: ${get('fontSizes.1')}px;
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.gray.6')};
  text-align: center;
  text-decoration: none;
  border-top: 1px solid ${get('colors.gray.2')};
  border-bottom: 1px solid ${get('colors.gray.2')};
  border-right: 1px solid ${get('colors.gray.2')};
  display: flex;
  align-items: center;

  &:first-child {
    border-top-left-radius: ${get('radii.1')}px;
    border-bottom-left-radius: ${get('radii.1')}px;
    border-left: 1px solid ${get('colors.gray.2')};
  }

  &:last-of-type {
    border-top-right-radius: ${get('radii.1')}px;
    border-bottom-right-radius: ${get('radii.1')}px;
    margin-right: ${get('space.2')}px;
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
`

SubNav.defaultProps = {
  theme
}

SubNav.propTypes = {
  actions: PropTypes.node,
  align: PropTypes.oneOf(['right']),
  children: PropTypes.node,
  full: PropTypes.bool,
  label: PropTypes.string,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

SubNav.Link.defaultProps = {
  theme
}

SubNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes
}

export default SubNav
