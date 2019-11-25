import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import PropTypes from 'prop-types'
import theme from './theme'
import {wrapperStyles} from './SelectMenuStyles'
import {ContextProvider} from './SelectMenuContext'
import SelectMenuDivider from './SelectMenuDivider'
import SelectMenuFilter from './SelectMenuFilter'
import SelectMenuFooter from './SelectMenuFooter'
import SelectMenuHeader from './SelectMenuHeader'
import SelectMenuItem from './SelectMenuItem'
import SelectMenuList from './SelectMenuList'
import SelectMenuLoading from './SelectMenuLoading'
import SelectMenuModal from './SelectMenuModal'
import SelectMenuSummary from './SelectMenuSummary'
import SelectMenuTab from './SelectMenuTab'
import SelectMenuTabs from './SelectMenuTabs'
import SelectMenuTabPanel from './SelectMenuTabPanel'
import useKeyboardNav from './hooks/KeyboardHook'

const SelectMenuBase = ({children, initialTab, ...rest}) => {
  const detailsRef = useRef(null)
  const [selectedTab, setSelectedTab] = useState(initialTab)
  const [filterText, setFilterText] = useState(undefined)
  const menuProviderValues = {
    selectedTab,
    setSelectedTab,
    filterText,
    setFilterText
  }
  useKeyboardNav(detailsRef)
  return (
    <ContextProvider value={menuProviderValues}>
      <details ref={detailsRef} {...rest}>
        {children}
      </details>
    </ContextProvider>
  )
}

const SelectMenu = styled(SelectMenuBase)`
  ${wrapperStyles}
  ${COMMON}
`

SelectMenu.Fragment = props => <include-fragement {...props} />
SelectMenu.ContextProvider = ContextProvider
SelectMenu.Divider = SelectMenuDivider
SelectMenu.Filter = SelectMenuFilter
SelectMenu.Footer = SelectMenuFooter
SelectMenu.Header = SelectMenuHeader
SelectMenu.Item = SelectMenuItem
SelectMenu.List = SelectMenuList
SelectMenu.Loading = SelectMenuLoading
SelectMenu.Modal = SelectMenuModal
SelectMenu.Summary = SelectMenuSummary
SelectMenu.Tabs = SelectMenuTabs
SelectMenu.Tab = SelectMenuTab
SelectMenu.TabPanel = SelectMenuTabPanel

SelectMenu.defaultProps = {
  theme
}

SelectMenu.propTypes = {
  preload: PropTypes.bool
}
export default SelectMenu
