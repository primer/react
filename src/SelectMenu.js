import styled from 'styled-components'
import {COMMON} from './constants'
import {wrapperStyles} from './SelectMenuStyles'
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

const SelectMenu = styled.details`
  ${wrapperStyles}
  ${COMMON}
`
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

export default SelectMenu
