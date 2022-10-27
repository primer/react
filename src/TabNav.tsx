import classnames from 'classnames'
import {To} from 'history'
import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {get} from './constants'
import {FocusKeys, useFocusZone} from './hooks/useFocusZone'
import sx, {SxProp} from './sx'
import {ComponentProps} from './utils/types'
import getGlobalFocusStyles from './_getGlobalFocusStyles'

const ITEM_CLASS = 'TabNav-item'
const SELECTED_CLASS = 'selected'

const TabNavBase = styled.div<SxProp>`
  ${sx}
`

const TabNavTabList = styled.div`
  display: flex;
  margin-bottom: -1px;
  overflow: auto;
`

const TabNavNav = styled.nav`
  margin-top: 0;
  border-bottom: 1px solid ${get('colors.border.default')};
`

export type TabNavProps = ComponentProps<typeof TabNavBase>

function TabNav({children, 'aria-label': ariaLabel, ...rest}: TabNavProps) {
  const customContainerRef = useRef<HTMLElement>(null)
  // TODO: revert tracking when `initialFocus` is set. This is a fix when TabNav
  // is nested within another focus zone. This flag is used to indicate when
  // focus has been initially set, this is useful for including the
  // `aria-selected="true"` tab as the first interactive item.
  //
  // When set to `true`, this changes the behavior in `useFocusZone` to use
  // the `'previous'` strategy which allows the tab to participate in nested
  // focus zones without conflict
  const [initialFocus, setInitialFocus] = useState(false)
  const customStrategy = React.useCallback(() => {
    if (customContainerRef.current) {
      const tabs = Array.from(
        customContainerRef.current.querySelectorAll<HTMLElement>('[role=tab][aria-selected=true]')
      )
      setInitialFocus(true)
      return tabs[0]
    }
  }, [customContainerRef])
  const {containerRef: navRef} = useFocusZone(
    {
      containerRef: customContainerRef,
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusOutBehavior: 'wrap',
      focusInStrategy: initialFocus ? 'previous' : customStrategy,
      focusableElementFilter: element => element.getAttribute('role') === 'tab'
    },
    [initialFocus]
  )
  return (
    <TabNavBase {...rest} ref={navRef as React.RefObject<HTMLDivElement>}>
      <TabNavNav aria-label={ariaLabel}>
        <TabNavTabList role="tablist">{children}</TabNavTabList>
      </TabNavNav>
    </TabNavBase>
  )
}

type StyledTabNavLinkProps = {
  to?: To
  selected?: boolean
} & SxProp

const TabNavLink = styled.a.attrs<StyledTabNavLinkProps>(props => ({
  activeClassName: typeof props.to === 'string' ? 'selected' : '',
  className: classnames(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
  tabIndex: -1
}))<StyledTabNavLinkProps>`
  padding: 8px 12px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  text-decoration: none;
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 0;

  ${getGlobalFocusStyles('-6px')};

  &:hover,
  &:focus {
    color: ${get('colors.fg.default')};
    text-decoration: none;
  }

  &.selected {
    color: ${get('colors.fg.default')};
    border-color: ${get('colors.border.default')};
    border-top-right-radius: ${get('radii.2')};
    border-top-left-radius: ${get('radii.2')};
    background-color: ${get('colors.canvas.default')};
  }

  ${sx};
`

TabNavLink.displayName = 'TabNav.Link'

export type TabNavLinkProps = ComponentProps<typeof TabNavLink>
export default Object.assign(TabNav, {Link: TabNavLink})
