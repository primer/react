import React, {useContext} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {tabWrapperStyles, tabStyles} from './SelectMenuStyles'
import {COMMON} from './constants'
import {MenuContext} from './SelectMenuContext'
import uuid from 'uuid'

import theme from './theme'

const TabBase = ({name, index, ...rest}) => {
  const menuContext = useContext(MenuContext)
  const handleClick = () => {
    menuContext.setSelectedTab(name)
  }
  if (!menuContext.selectedTab && index === 0) {
    menuContext.setSelectedTab(name)
  }

  const isSelected = menuContext.selectedTab === name

  return (
    <button role="tab" className="SelectMenuTab" aria-selected={isSelected} onClick={handleClick} {...rest}>
      {name}
    </button>
  )
}

const SelectMenuTab = styled(TabBase)`
  ${tabStyles}
`

const Tabs = ({className, tabs}) => {
  return (
    <div role="tablist" className={className}>
      {tabs.map((tab, index) => (
        <SelectMenuTab key={uuid()} index={index} name={tab} />
      ))}
    </div>
  )
}

const SelectMenuTabs = styled(Tabs)`
  ${tabWrapperStyles}
  ${COMMON}
`

SelectMenuTabs.defaultProps = {
  theme
}

SelectMenuTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string),
  ...COMMON.propTypes
}

export default SelectMenuTabs
