import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Check} from '@primer/octicons-react'
import {listItemStyles} from './SelectMenuStyles'
import {MenuContext} from './SelectMenuContext'
import {COMMON} from '../constants'
import StyledOcticon from '../StyledOcticon'
import theme from '../theme'

const StyledItem = styled.a.attrs(() => ({
  role: 'menuitemcheckbox'
}))`
  ${listItemStyles}
  ${COMMON}
`

// 'as' is spread out because we don't want users to be able to change the tag. using something
// other than 'a' will break a11y.
const SelectMenuItem = ({children, selected, onClick, as, ...rest}) => {
  const menuContext = useContext(MenuContext)

  // close the menu when an item is clicked
  // this can be overriden if the user provides a `onClick` prop and prevents default in it
  const handleClick = e => {
    onClick && onClick(e)

    if (!e.defaultPrevented) {
      menuContext.setOpen(false)
    }
  }
  return (
    <StyledItem {...rest} onClick={handleClick} aria-checked={selected}>
      <StyledOcticon className="SelectMenu-icon SelectMenu-selected-icon" icon={Check} />
      {children}
    </StyledItem>
  )
}

SelectMenuItem.defaultProps = {
  theme,
  selected: false
}

SelectMenuItem.propTypes = {
  selected: PropTypes.bool,
  ...COMMON.propTypes
}

export default SelectMenuItem
