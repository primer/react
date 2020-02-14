import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import PropTypes from 'prop-types'
import theme from './theme'
import {wrapperStyles} from './SelectMenuStyles'
import {MenuContext} from './SelectMenuContext'
import SelectMenuDivider from './SelectMenuDivider'
import SelectMenuFilter from './SelectMenuFilter'
import SelectMenuFooter from './SelectMenuFooter'
import SelectMenuHeader from './SelectMenuHeader'
import SelectMenuItem from './SelectMenuItem'
import SelectMenuList from './SelectMenuList'
import SelectMenuModal from './SelectMenuModal'
import SelectMenuSummary from './SelectMenuSummary'
import SelectMenuTabs from './SelectMenuTabs'
import SelectMenuTabPanel from './SelectMenuTabPanel'
import useKeyboardNav from './hooks/KeyboardHook'

const SelectMenuBase = ({children, initialTab, ...rest}) => {
  const ref = useRef(null)
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const [filterText, setFilterText] = useState(undefined)
  const [open, setOpen] = useState(false)
  useKeyboardNav(ref)
  const menuProviderValues = {
    selectedTab,
    setSelectedTab,
    filterText,
    setFilterText,
    open,
    initialTab
  }

  function toggle(event) {
    setOpen(event.target.open)
  }

  return (
    <MenuContext.Provider value={menuProviderValues}>
      <details ref={ref} {...rest} onToggle={toggle}>
        {children}
      </details>
    </MenuContext.Provider>
  )
}

const SelectMenu = styled(SelectMenuBase)`
  ${wrapperStyles}
  ${COMMON}
`

SelectMenu.Fragment = props => <include-fragement {...props} />
SelectMenu.MenuContext = MenuContext
SelectMenu.Divider = SelectMenuDivider
SelectMenu.Filter = SelectMenuFilter
SelectMenu.Footer = SelectMenuFooter
SelectMenu.Header = SelectMenuHeader
SelectMenu.Item = SelectMenuItem
SelectMenu.List = SelectMenuList
SelectMenu.Modal = SelectMenuModal
SelectMenu.Summary = SelectMenuSummary
SelectMenu.Tabs = SelectMenuTabs
SelectMenu.TabPanel = SelectMenuTabPanel

SelectMenu.defaultProps = {
  theme
}

SelectMenu.propTypes = {
  preload: PropTypes.bool
}
export default SelectMenu
