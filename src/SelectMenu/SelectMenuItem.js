import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {Check} from '@primer/octicons-react'
import {listItemStyles} from './SelectMenuStyles'
import {COMMON} from '../constants'
import StyledOcticon from '../StyledOcticon'
import theme from '../theme'

const StyledItem = styled.a.attrs(() => ({
  role: 'menuitemcheckbox',
}))`
  ${listItemStyles}
  ${COMMON}
`

// 'as' is spread out because we don't want users to be able to change the tag. using something
// other than 'a' will break a11y
const SelectMenuItem = ({children, selected, as, ...rest}) => {
  return (
    <StyledItem {...rest} aria-checked={selected}>
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
