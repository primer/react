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
  border-bottom: 1px solid ${get('colors.gray.2')};
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
  padding: ${get('space.3')}px ${get('space.2')}px;
  margin-right: ${get('space.3')}px;
  font-size: ${get('fontSizes.1')}px;
  line-height: ${get('lineHeights.default')};
  color: ${get('colors.gray.6')};
  text-align: center;
  border-bottom: 2px solid transparent;
  text-decoration: none;

  &:hover,
  &:focus {
    color: ${get('colors.gray.9')};
    text-decoration: none;
    border-bottom-color: ${get('colors.gray.3')};
    transition: 0.2s ease;

    .SubNav-octicon {
      color: ${get('colors.gray.5')};
    }
  }

  &.selected {
    font-weight: ${get('fontWeights.bold')};
    color: ${get('colors.gray.9')};
    border-bottom-color: ${get('colors.orange.6')};

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
