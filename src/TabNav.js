import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

function TabNavBase({actions, className, align, children, full, label, ...rest}) {
  const classes = classnames(className, 'TabNav')
  return (
    <nav className={classes} aria-label={label} {...rest}>
      <div className="TabNav-body">{children}</div>
    </nav>
  )
}

const TabNav = styled(TabNavBase)`
  display: flex;
  border-bottom: 1px solid ${get('colors.gray.3')};

  .TabNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  ${COMMON};
`

TabNav.Link = styled.a.attrs(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className)
}))`
  padding: 8px 12px;
  font-size: ${get('fontSizes.1')}px;
  line-height: 20px;
  color: ${get('colors.gray.6')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

  &:hover,
  &:focus {
    color: ${get('colors.gray.9')};
    text-decoration: none;
  }

  &.selected {
    color: ${get('colors.gray.9')};
    border-color: ${get('colors.gray.3')};
    border-radius: 3px 3px 0 0;
    background-color: ${get('colors.white')};
  }
`

TabNav.defaultProps = {
  theme
}

TabNav.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...COMMON.propTypes
}

TabNav.Link.defaultProps = {
  theme
}

TabNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  selected: PropTypes.bool,
  ...COMMON.propTypes
}

export default TabNav
