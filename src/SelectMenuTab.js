import React, {useContext} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {tabStyles} from './SelectMenuStyles'
import {MenuContext} from './SelectMenuModal'
import theme from './theme'
import {COMMON} from './constants'

const TabBase = ({name, ...rest}) => {
  const menuContext = useContext(MenuContext)
  const handleClick = () => {
    menuContext.setSelectedTab(name)
  }
  const isSelected = menuContext.selectedTab === name

  return (
    <button role='tab' className='SelectMenuTab' aria-selected={isSelected} onClick={handleClick} {...rest}>
      {name}
    </button>
  )
}

const SelectMenuTab = styled(TabBase)`
  ${tabStyles}
  ${COMMON}
`

SelectMenuTab.defaultProps = {
  theme
}

SelectMenuTab.propTypes = {
  name: PropTypes.string
}

export default SelectMenuTab
