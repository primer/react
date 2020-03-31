import React, {useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuContext} from './SelectMenuContext'
import {tabStyles} from './SelectMenuStyles'

const TabBase = ({tabName, index, onClick, ...rest}) => {
  const menuContext = useContext(MenuContext)
  const handleClick = e => {
    // if consumer has attached an onClick event, call it
    onClick && onClick(e)
    if (!e.defaultPrevented) {
      menuContext.setSelectedTab(tabName)
    }
  }

  // if no tab is selected when the component renders, show the first tab
  useEffect(() => {
    if (!menuContext.selectedTab && index === 0) {
      menuContext.setSelectedTab(tabName)
    }
  }, [])

  const isSelected = menuContext.selectedTab === tabName

  return (
    <button role="tab" className="SelectMenuTab" aria-selected={isSelected} onClick={handleClick} {...rest}>
      {tabName}
    </button>
  )
}

const SelectMenuTab = styled(TabBase)`
  ${tabStyles}
`

SelectMenuTab.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func,
  tabName: PropTypes.string
}

export default SelectMenuTab
