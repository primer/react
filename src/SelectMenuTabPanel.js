import React, {useContext} from 'react'
import SelectMenuList from './SelectMenuList'
import {MenuContext} from './SelectMenuModal'

const SelectMenuTabPanel = ({children, tabName}) => {
  const menuContext = useContext(MenuContext);
  return (
    <SelectMenuList hidden={menuContext.selectedTab !== tabName}>
      {children}
    </SelectMenuList>
  )
}

export default SelectMenuTabPanel