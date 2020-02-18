import React from 'react'
import styled from 'styled-components'
import {listStyles} from './SelectMenuStyles'
import theme from './theme'
import {COMMON} from './constants'

const List = ({children, ...rest}) => {
  return (
    <div role="menu" {...rest}>
      <ul>{children}</ul>
    </div>
  )
}

const SelectMenuList = styled(List)`
  ${listStyles}
  ${COMMON}

  ul {
    padding: 0;
    margin: 0;
  }
`
SelectMenuList.defaultProps = {
  theme
}

SelectMenuList.propTypes = {
  ...COMMON.propTypes
}

export default SelectMenuList
