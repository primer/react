import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import {MenuContext} from './SelectMenuContext'

const SelectMenuTabPanel = ({tabName, children}) => {
  const menuContext = useContext(MenuContext)

  return (
    <div role="tabpanel" hidden={menuContext.selectedTab !== tabName}>
      {children}
    </div>
  )
}

SelectMenuTabPanel.propTypes = {
  tabName: PropTypes.string
}

export default SelectMenuTabPanel
