import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import clsx from 'clsx'
import type {To} from 'history'
import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import getGlobalFocusStyles from '../internal/utils/getGlobalFocusStyles'

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

/**
 * Tab nav contains a set of links that let users navigate between different views in the same context.
 * @primerid tab_nav
 * @primerstatus alpha
 * @primera11yreviewed false
 */
export function TabNav({
  /** Links in the tabbed navigation */
  children,
  /** Used to set the `aria-label` on the top level `<nav>` element. */
  'aria-label': ariaLabel,
  ...rest
}: TabNavProps) {
  const customContainerRef = useRef<HTMLElement>(null)

  // Detect if the TabNav is inside an ActionMenu.
  const [isInsideMenu, setIsInsideMenu] = useState(false)
  React.useEffect(() => {
    if (customContainerRef.current) {
      const menu = customContainerRef.current.closest<HTMLElement>('[role=menu]')
      if (menu) {
        setIsInsideMenu(true)
      }
    }
  }, [customContainerRef])

  const customStrategy = React.useCallback(() => {
    const selectedTab = customContainerRef.current?.querySelector<HTMLElement>('[role=tab][aria-selected=true]')
    const firstTab = customContainerRef.current?.querySelector<HTMLElement>('[role=tab]')
    return selectedTab ?? firstTab ?? undefined
  }, [customContainerRef])

  const {containerRef: navRef} = useFocusZone(
    {
      containerRef: customContainerRef,
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusOutBehavior: 'wrap',
      // Use 'previous' strategy when inside an ActionMenu to avoid
      // conflicting with the ActionMenu's focus zone.
      //
      // WARNING: We don't recommend using TabNav inside an ActionMenu.
      // This is a workaround to avoid breaking existing code.
      focusInStrategy: isInsideMenu ? 'previous' : customStrategy,
      focusableElementFilter: element => element.getAttribute('role') === 'tab',
    },
    [isInsideMenu],
  )

  return (
    <TabNavBase {...rest} ref={navRef as React.RefObject<HTMLDivElement>}>
      <TabNavNav aria-label={ariaLabel}>
        <TabNavTabList role="tablist">{children}</TabNavTabList>
      </TabNavNav>
    </TabNavBase>
  )
}

export type TabNavLinkProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
  /** Used when the item is rendered using a component like React Router's `Link`. The path to navigate to. */
  to?: To
  /** Whether this item represents the current page */
  selected?: boolean
  /** Used to populate the `href` attribute when using an `<a>` tag */
  href?: string
} & SxProp

/**
 * An individual link in the TabNav.
 * @alias TabNav.Link
 * @primerparentid tab_nav
 */
export const TabNavLink = styled.a.attrs<TabNavLinkProps>(props => ({
  className: clsx(ITEM_CLASS, props.selected && SELECTED_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
  tabIndex: -1,
}))<TabNavLinkProps>`
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
` as PolymorphicForwardRefComponent<'a', TabNavLinkProps>

TabNavLink.displayName = 'TabNav.Link'
