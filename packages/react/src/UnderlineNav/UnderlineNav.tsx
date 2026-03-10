import React, {forwardRef, useEffect, useRef, useState} from 'react'
import VisuallyHidden from '../_VisuallyHidden'
import {UnderlineItemList, UnderlineWrapper} from '../internal/components/UnderlineTabbedInterface'
import {invariant} from '../utils/invariant'
import classes from './UnderlineNav.module.css'
import {UnderlineNavContext} from './UnderlineNavContext'

export type UnderlineNavProps = {
  children: React.ReactNode
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType
  className?: string
  /**
   * loading state for all counters. It displays loading animation for individual counters (UnderlineNav.Item) until all are resolved. It is needed to prevent multiple layout shift.
   */
  loadingCounters?: boolean
  /**
   * There are cases where you may not want the horizontal padding on items,
   * and panels to make the tabs look horizontally aligned with the content above and below it.
   * Setting this to `flush` will remove the horizontal padding on the items.
   */
  variant?: 'inset' | 'flush'
}

const getValidChildren = (children: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement<any>[]
}

export const UnderlineNav = forwardRef<HTMLElement, UnderlineNavProps>(
  (
    {
      as = 'nav',
      'aria-label': ariaLabel,
      loadingCounters = false,
      variant = 'inset',
      className,
      children,
    }: UnderlineNavProps,
    forwardedRef,
  ) => {
    if (__DEV__) {
      const validChildren = getValidChildren(children)

      // Practically, this is not a conditional hook, it is just making sure this hook runs only on DEV not PROD.
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEffect(() => {
        // Address illegal state where there are multiple items that have `aria-current='page'` attribute
        const activeElements = validChildren.filter(child => {
          return child.props['aria-current'] !== undefined
        })
        invariant(activeElements.length <= 1, 'Only one current element is allowed')
        invariant(ariaLabel, 'Use the `aria-label` prop to provide an accessible label for assistive technology')
      })
    }

    const [hideIcons, setHideIcons] = useState(false)

    const scrollContainer = useRef<HTMLDivElement>(null)
    useEffect(() => {
      if (hideIcons || !scrollContainer.current) return

      // Putting the resizeobserver on the list ensures it runs if the contents change;
      // the container is fullwidth but the list is elastic
      const list = scrollContainer.current.querySelector('ul')
      if (!list) return

      const observer = new ResizeObserver(() => {
        if (scrollContainer.current!.scrollWidth > scrollContainer.current!.clientWidth) setHideIcons(true)
      })
      observer.observe(list)

      return () => observer.disconnect()
    }, [hideIcons])

    return (
      <UnderlineNavContext.Provider
        value={{
          loadingCounters,
        }}
      >
        {ariaLabel && <VisuallyHidden as="h2">{`${ariaLabel} navigation`}</VisuallyHidden>}
        <div className={classes.ScrollContainer} data-hide-icons={hideIcons} ref={scrollContainer}>
          <UnderlineWrapper
            as={as}
            aria-label={ariaLabel}
            className={className}
            ref={forwardedRef}
            data-variant={variant}
            data-overflow-mode="wrap"
            style={{minWidth: 'fit-content'}}
          >
            <UnderlineItemList role="list">{children}</UnderlineItemList>
          </UnderlineWrapper>
        </div>
      </UnderlineNavContext.Provider>
    )
  },
)

UnderlineNav.displayName = 'UnderlineNav'
