import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useRef, useState} from 'react'
import {FocusKeys, useFocusZone} from '../hooks/useFocusZone'

import styles from './TabNav.module.css'

/**
 * @deprecated
 */
export type TabNavProps = React.HTMLProps<HTMLDivElement>

/**
 * @deprecated
 */
function TabNav({children, 'aria-label': ariaLabel, ...rest}: TabNavProps) {
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
    <div {...rest} ref={navRef as React.RefObject<HTMLDivElement>}>
      <nav aria-label={ariaLabel} className={styles.TabNavNav}>
        <div role="tablist" className={styles.TabNavTabList}>
          {children}
        </div>
      </nav>
    </div>
  )
}

/**
 * @deprecated
 */
export type TabNavLinkProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
  to?: To
  selected?: boolean
  href?: string
  className?: string
  as?: React.ElementType | 'a' | 'button' | 'div'
  disabled?: boolean
}

/**
 * @deprecated
 */
const TabNavLink = React.forwardRef<HTMLAnchorElement, TabNavLinkProps>(function TabNavLink(
  {selected, className, as: Component = 'a', ...rest}: TabNavLinkProps,
  ref,
) {
  return (
    <Component
      ref={ref}
      role="tab"
      tabIndex={-1}
      aria-selected={selected ? true : undefined}
      className={clsx('TabNav-item', styles.TabNavLink, selected && 'selected', selected && styles.Selected, className)}
      {...rest}
    />
  )
})

TabNavLink.displayName = 'TabNav.Link'

export default Object.assign(TabNav, {Link: TabNavLink})
