import React, {useContext} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {tabStyles} from './SelectMenuStyles'
import {TabContext} from './SelectMenuTabs'
import theme from './theme'
import {COMMON} from './constants'

const TabBase = ({name, ...rest}) => {
  const tabContext = useContext(TabContext)
  const handleClick = () => tabContext.setSelectedTab(name)
  const isSelected = tabContext.selectedTab === name

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
