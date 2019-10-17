import React from 'react'
import styled from 'styled-components'
import {Check} from '@primer/octicons-react'
import {listItemStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import StyledOcticon from './StyledOcticon'
import theme from './theme'

const StyledItem = styled.a.attrs(() => ({
  role: 'menuitem',
  className: 'SelectMenu--list-item'
}))`
  ${listItemStyles}
  ${COMMON}
`

const SelectMenuItem = ({children, ...rest}) => {
  return (
    <StyledItem {...rest}>
      <StyledOcticon className="SelectMenu-selected" icon={Check} />
      {children}
    </StyledItem>
  )
}

SelectMenuItem.defaultProps = {
  theme
}

export default SelectMenuItem
