import React from 'react'
import styled from 'styled-components'
import {listStyles} from './SelectMenuStyles'
import theme from './theme'

const List = ({children, ...rest}) => {
  return (
    <div role="menu" id="filter-menu" {...rest}>
      <ul data-filter-list>{children}</ul>
    </div>
  )
}

const SelectMenuList = styled(List)`
  ${listStyles}

  ul {
    padding: 0;
    margin: 0;
  }
`
SelectMenuList.defaultProps = {
  theme
}

export default SelectMenuList
