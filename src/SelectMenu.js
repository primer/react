import React from 'react'
import styled from 'styled-components'
import {COMMON} from './constants'
import PropTypes from 'prop-types'
import theme from './theme'
import {wrapperStyles} from './SelectMenuStyles'
import SelectMenuDivider from './SelectMenuDivider'
import SelectMenuFilter from './SelectMenuFilter'
import SelectMenuFooter from './SelectMenuFooter'
import SelectMenuHeader from './SelectMenuHeader'
import SelectMenuItem from './SelectMenuItem'
import SelectMenuList from './SelectMenuList'
import SelectMenuLoading from './SelectMenuLoading'
import {SelectMenuModal, MenuContext} from './SelectMenuModal'
import SelectMenuSummary from './SelectMenuSummary'
import SelectMenuTab from './SelectMenuTab'
import SelectMenuTabs from './SelectMenuTabs'
import SelectMenuTabPanel from './SelectMenuTabPanel'
import useKeyboardNav from './KeyboardHook'

const SelectMenuBase = ({children, ...rest}) => {
  const detailsRef = useKeyboardNav()
  return (
    <details ref={detailsRef} {...rest}>
      {children}
    </details>
  )
}

const SelectMenu = styled(SelectMenuBase)`
  ${wrapperStyles}
  ${COMMON}
`

SelectMenu.Fragment = props => <include-fragement {...props} />
SelectMenu.Context = MenuContext
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
