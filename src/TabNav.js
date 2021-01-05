import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'
import sx from './sx'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

function TabNavBase({actions, className, align, children, full, theme, ...rest}) {
  const classes = classnames(className, 'TabNav')
  return (
    <nav className={classes} {...rest}>
      <div className="TabNav-body">{children}</div>
    </nav>
  )
}

const TabNav = styled(TabNavBase)`
  display: flex;
  border-bottom: 1px solid ${get('colors.border.gray')};

  .TabNav-body {
    display: flex;
    margin-bottom: -1px;
  }

  ${COMMON};
  ${sx};
`

TabNav.Link = styled.a.attrs((props) => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
}))`
  padding: 8px 12px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.black')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

  &:hover,
  &:focus {
    color: ${get('colors.text.grayDark')};
    text-decoration: none;
  }

  &.selected {
    color: ${get('colors.text.grayDark')};
    border-color: ${get('colors.border.gray')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.white')};
  }

  ${COMMON};
  ${sx};
`

TabNav.defaultProps = {
  theme,
}

TabNav.propTypes = {
  children: PropTypes.node,
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...sx.propTypes,
}

TabNav.Link.defaultProps = {
  theme,
}

TabNav.Link.propTypes = {
  as: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  href: PropTypes.string,
  selected: PropTypes.bool,
  ...COMMON.propTypes,
  ...sx.propTypes,
}

TabNav.Link.displayName = 'TabNav.Link'

export default TabNav
