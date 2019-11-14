import React from 'react'
import styled from 'styled-components'
import {tabWrapperStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import theme from './theme'

const Tabs = ({children}) => {
  return (
    <nav role='tablist'>
      {children}
    </nav>
  )
}

const SelectMenuTabs = styled(Tabs)`
  ${tabWrapperStyles}
  ${COMMON}
`

SelectMenuTabs.defaultProps = {
  theme
}

export default SelectMenuTabs
