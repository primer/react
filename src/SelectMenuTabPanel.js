import React, {useContext} from 'react'
import {TabContext} from './SelectMenuTabs'

const SelectMenuTabPanel = ({children, tabName}) => {
  const tabContext = useContext(TabContext);
  return (
    <div hidden={tabContext.selectedTab !== tabName}>
      {children}
    </div>
  )
}

export default SelectMenuTabPanel