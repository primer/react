import React from 'react'
import styled from 'styled-components'
import {Check} from '@primer/octicons-react'
import {listItemStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import StyledOcticon from './StyledOcticon'
import theme from './theme'

const StyledItem = styled.li.attrs(() => ({
  role: 'menuitem'
}))`
  ${listItemStyles}
  ${COMMON}
`

const SelectMenuItem = ({children, selected, href, ...rest}) => {
  return (
    <StyledItem {...rest} aria-checked={selected}>
      <a href={href}>
        <StyledOcticon className="SelectMenu-icon SelectMenu-selected-icon" icon={Check} />
        {children}
      </a>
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
