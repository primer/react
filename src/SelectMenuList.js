import React, {useContext} from 'react'
import styled from 'styled-components'
import {listStyles} from './SelectMenuStyles'
import SelectMenuItem from './SelectMenuItem'
import PropTypes from 'prop-types'
import theme from './theme'
import {MenuContext} from './SelectMenuModal'
import uuid from 'uuid'

const List = ({children, ...rest}) => {
  return (
    <div role="menu" id="filter-menu" {...rest}>
      <ul data-filter-list>
        {children}
      </ul>
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
