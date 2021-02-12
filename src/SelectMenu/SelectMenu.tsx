import React, {useRef, useState, useCallback, useEffect} from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import sx, {SxProp} from '../sx'
import {COMMON, SystemCommonProps} from '../constants'
import theme from '../theme'
import {MenuContext} from './SelectMenuContext'
import SelectMenuDivider from './SelectMenuDivider'
import SelectMenuFilter from './SelectMenuFilter'
import SelectMenuFooter from './SelectMenuFooter'
import SelectMenuItem from './SelectMenuItem'
import SelectMenuList from './SelectMenuList'
import SelectMenuModal from './SelectMenuModal'
import SelectMenuTabs from './SelectMenuTabs'
import SelectMenuHeader from './SelectMenuHeader'
import SelectMenuTab from './SelectMenuTab'
import SelectMenuTabPanel from './SelectMenuTabPanel'
import SelectMenuLoadingAnimation from './SelectMenuLoadingAnimation'
import useKeyboardNav from './hooks/useKeyboardNav'
import {ComponentProps} from '../utils/types'

const wrapperStyles = `
  // Remove marker added by the display: list-item browser default
  > summary {
    list-style: none;
  }
  // Remove marker added by details polyfill
  > summary::before {
    display: none;
  }
  // Remove marker added by Chrome
  > summary::-webkit-details-marker {
    display: none;
  }
`

const StyledSelectMenu = styled.details<SystemCommonProps & SxProp>`
  ${wrapperStyles}
  ${COMMON}
  ${sx};
`

type SelectMenuInternalProps = {
  initialTab?: string
  as?: React.ReactElement
} & ComponentProps<typeof StyledSelectMenu>

// 'as' is spread out because we don't want users to be able to change the tag.
const SelectMenu = React.forwardRef<HTMLElement, SelectMenuInternalProps>(
  ({children, initialTab = '', as, ...rest}, forwardedRef) => {
    const backupRef = useRef<HTMLElement>(null)
    const ref = forwardedRef ?? backupRef
    const [selectedTab, setSelectedTab] = useState(initialTab)
    const [open, setOpen] = useState(false)
    const menuProviderValues = {
      selectedTab,
      setSelectedTab,
      setOpen,
      open,
      initialTab
    }

    const onClickOutside = useCallback(
      event => {
        if ('current' in ref && ref.current && !ref.current.contains(event.target)) {
          if (!event.defaultPrevented) {
            setOpen(false)
          }
        }
      },
      [ref, setOpen]
    )

    // handles the overlay behavior - closing the menu when clicking outside of it
    useEffect(() => {
      if (open) {
        document.addEventListener('click', onClickOutside)
        return () => {
          document.removeEventListener('click', onClickOutside)
        }
      }
    }, [open, onClickOutside])

    function toggle(event: React.SyntheticEvent<HTMLDetailsElement, Event>) {
      setOpen((event.target as HTMLDetailsElement).open)
    }

    useKeyboardNav(ref, open, setOpen)

    return (
      <MenuContext.Provider value={menuProviderValues}>
        <StyledSelectMenu ref={ref} {...rest} open={open} onToggle={toggle}>
          {children}
        </StyledSelectMenu>
      </MenuContext.Provider>
    )
  }
)

SelectMenu.displayName = 'SelectMenu'

SelectMenu.defaultProps = {
  theme
}

SelectMenu.propTypes = {
  initialTab: PropTypes.string,
  ...COMMON.propTypes,
  ...sx.propTypes
}

export type SelectMenuProps = ComponentProps<typeof SelectMenu>
export type {SelectMenuDividerProps} from './SelectMenuDivider'
export type {SelectMenuFilterProps} from './SelectMenuFilter'
export type {SelectMenuFooterProps} from './SelectMenuFooter'
export type {SelectMenuItemProps} from './SelectMenuItem'
export type {SelectMenuListProps} from './SelectMenuList'
export type {SelectMenuModalProps} from './SelectMenuModal'
export type {SelectMenuTabsProps} from './SelectMenuTabs'
export type {SelectMenuHeaderProps} from './SelectMenuHeader'
export type {SelectMenuTabProps} from './SelectMenuTab'
export type {SelectMenuTabPanelProps} from './SelectMenuTabPanel'
export type {SelectMenuLoadingAnimationProps} from './SelectMenuLoadingAnimation'
export default Object.assign(SelectMenu, {
  MenuContext: MenuContext,
  List: SelectMenuList,
  Divider: SelectMenuDivider,
  Filter: SelectMenuFilter,
  Footer: SelectMenuFooter,
  Item: SelectMenuItem,
  Modal: SelectMenuModal,
  Tabs: SelectMenuTabs,
  Tab: SelectMenuTab,
  TabPanel: SelectMenuTabPanel,
  Header: SelectMenuHeader,
  LoadingAnimation: SelectMenuLoadingAnimation
})
