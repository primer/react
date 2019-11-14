import React, {createContext, useState} from 'react'
import styled from 'styled-components'
import {tabWrapperStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import theme from './theme'

const TabContext = createContext()

const Tabs = ({children, initialTab}) => {
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const tabProviderValue = { selectedTab, setSelectedTab }
  return (
    <TabContext.Provider value={tabProviderValue}>
      <nav role='tablist'>
        {children}
      </nav>
    </TabContext.Provider>
  )
}

const SelectMenuTabs = styled(Tabs)`
  ${tabWrapperStyles}
  ${COMMON}
`

SelectMenuTabs.defaultProps = {
  theme
}

export {TabContext, SelectMenuTabs}
