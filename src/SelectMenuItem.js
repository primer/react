import React from 'react'
import styled from 'styled-components'
import {Check} from '@primer/octicons-react'
import {listItemStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import StyledOcticon from './StyledOcticon'
import theme from './theme'

const StyledItem = styled.li.attrs(() => ({
  role: 'menuitem',
  className: 'SelectMenu--list-item'
}))`
  ${listItemStyles}
  ${COMMON}
`

const SelectMenuItem = ({children, selected, ...rest}) => {
  return (
    <StyledItem {...rest}>
      {selected && <StyledOcticon className="SelectMenu-selected" icon={Check} />}
      {children}
    </StyledItem>
  )
}

SelectMenuItem.defaultProps = {
  theme,
  selected: false
}

export default SelectMenuItem
