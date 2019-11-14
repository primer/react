import React, {useContext} from 'react'
import SelectMenuList from './SelectMenuList'
import {MenuContext} from './SelectMenuModal'
import SelectMenuItem from './SelectMenuItem'
import uuid from 'uuid'

const SelectMenuTabPanel = ({tabName, items}) => {
  const menuContext = useContext(MenuContext);
  React.useEffect(() => {
    if (menuContext.selectedTab === tabName){
      menuContext.setItems(items)
    }
  }, [menuContext.selectedTab])

  const itemSource = menuContext.isFiltering ? menuContext.results : menuContext.items

  return (
    <SelectMenuList hidden={menuContext.selectedTab !== tabName}>
      {itemSource.map(item => {
        return <SelectMenuItem key={uuid()} href={item.url}>{item.title}</SelectMenuItem>
      })}
    </SelectMenuList>
  )
}

export default SelectMenuTabPanel