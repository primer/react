import React, {useContext} from 'react'
import {MenuContext} from './SelectMenuContext'

const SelectMenuTabPanel = ({tabName, children}) => {
  const menuContext = useContext(MenuContext)

  return (
    <div role="tabpanel" hidden={menuContext.selectedTab !== tabName}>
      {children}
    </div>
  )
}

export default SelectMenuTabPanel
