import React, {
  Children,
  isValidElement,
  cloneElement,
  useState,
  useRef,
  useMemo,
  useCallback,
  type FC,
  type PropsWithChildren,
  type ElementType,
} from 'react'
import {TabContainerElement} from '@github/tab-container-element'
import type {IconProps} from '@primer/octicons-react'
import {createComponent} from '../../utils/create-component'
import {
  UnderlineItemList,
  UnderlineWrapper,
  UnderlineItem,
  type UnderlineItemProps,
} from '../../internal/components/UnderlineTabbedInterface'
import {useId} from '../../hooks'
import {invariant} from '../../utils/invariant'
import {useResizeObserver} from '../../hooks/useResizeObserver'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import classes from './UnderlinePanels.module.css'
import {clsx} from 'clsx'
import {isSlot} from '../../utils/is-slot'
import type {FCWithSlotMarker} from '../../utils/types'

export type UnderlinePanelsProps = {
  /**
   * Tabs (UnderlinePanels.Tab) and panels (UnderlinePanels.Panel) to render
   */
  children: React.ReactNode
  /**
   * Accessible name for the tab list
   */
  'aria-label'?: React.AriaAttributes['aria-label']
  /**
   * ID of the element containing the name for the tab list
   */
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  /**
   * Custom string to use when generating the IDs of tabs and `aria-labelledby` for the panels
   */
  id?: string
  /**
   * Loading state for all counters. It displays loading animation for individual counters until all are resolved. It is needed to prevent multiple layout shift.
   */
  loadingCounters?: boolean
  /**
   * Class name for custom styling
   */
  className?: string
  /**
   * Element type for the tab container
   */
  as?: React.ElementType
}

export type TabProps = PropsWithChildren<{
  /**
   * Whether this is the selected tab
   */
  'aria-selected'?: boolean
  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onSelect?: (event: React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => void
  /**
   * Content of CounterLabel rendered after tab text label
   */
  counter?: number | string
  /**
   *  Icon rendered before the tab text label
   */
  icon?: FC<IconProps>
}>

export type PanelProps = React.HTMLAttributes<HTMLDivElement>

const TabContainerComponent = createComponent(TabContainerElement, 'tab-container')

const UnderlinePanels: FCWithSlotMarker<UnderlinePanelsProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  loadingCounters,
  className,
  ...props
}) => {
  const [iconsVisible, setIconsVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  // We need to always call useId() because React Hooks must be
  // called in the exact same order in every component render
  const parentId = useId(props.id)

  // Derive tabs / tabPanels during render via useMemo instead of syncing
  // to state through a post-paint useEffect. The previous pattern committed
  // an extra render every time children or `iconsVisible` changed; this
  // version produces the correct values on the very first render.
  const {tabs, tabPanels} = useMemo(() => {
    let tabIndex = 0
    let panelIndex = 0

    const childrenWithProps = Children.map(children, child => {
      if (isValidElement<UnderlineItemProps<ElementType>>(child) && (child.type === Tab || isSlot(child, Tab))) {
        return cloneElement(child, {id: `${parentId}-tab-${tabIndex++}`, loadingCounters, iconsVisible})
      }

      if (isValidElement<PanelProps>(child) && (child.type === Panel || isSlot(child, Panel))) {
        const childPanel = child as React.ReactElement<PanelProps>
        return cloneElement(childPanel, {'aria-labelledby': `${parentId}-tab-${panelIndex++}`})
      }
      return child
    })

    const nextTabs = Children.toArray(childrenWithProps).filter(child => {
      return isValidElement(child) && (child.type === Tab || isSlot(child, Tab))
    })

    const nextTabPanels = Children.toArray(childrenWithProps).filter(
      child => isValidElement(child) && (child.type === Panel || isSlot(child, Panel)),
    )

    return {tabs: nextTabs, tabPanels: nextTabPanels}
  }, [children, parentId, loadingCounters, iconsVisible])

  const tabsHaveIcons = useMemo(() => tabs.some(tab => React.isValidElement(tab) && tab.props.icon), [tabs])

  // Single source of truth for the icon-visibility decision, used by both the
  // initial layout-effect pass and the ResizeObserver. Measuring list and
  // wrapper together at decision time removes the need to hold list width in
  // state.
  const recomputeIconsVisible = useCallback(() => {
    if (!tabsHaveIcons || !listRef.current || !wrapperRef.current) return
    const wrapperWidth = wrapperRef.current.getBoundingClientRect().width
    const listWidth = listRef.current.getBoundingClientRect().width
    const next = wrapperWidth > listWidth
    setIconsVisible(prev => (prev === next ? prev : next))
  }, [tabsHaveIcons])

  useIsomorphicLayoutEffect(() => {
    recomputeIconsVisible()
  }, [recomputeIconsVisible])

  useResizeObserver(
    () => {
      recomputeIconsVisible()
    },
    wrapperRef,
    [],
  )

  if (__DEV__) {
    const selectedTabs = tabs.filter(tab => {
      const ariaSelected = React.isValidElement(tab) && tab.props['aria-selected']

      return ariaSelected === true || ariaSelected === 'true'
    })

    invariant(selectedTabs.length <= 1, 'Only one tab can be selected at a time.')

    invariant(
      tabs.length === tabPanels.length,
      `The number of tabs and panels must be equal. Counted ${tabs.length} tabs and ${tabPanels.length} panels.`,
    )
  }

  return (
    <TabContainerComponent>
      <UnderlineWrapper
        ref={wrapperRef}
        slot="tablist-wrapper"
        data-icons-visible={iconsVisible}
        className={clsx(className, classes.StyledUnderlineWrapper)}
        {...props}
      >
        <UnderlineItemList ref={listRef} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} role="tablist">
          {tabs}
        </UnderlineItemList>
      </UnderlineWrapper>
      {tabPanels}
    </TabContainerComponent>
  )
}

const Tab: FCWithSlotMarker<TabProps> = ({'aria-selected': ariaSelected, onSelect, ...props}) => {
  const clickHandler = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (!event.defaultPrevented && typeof onSelect === 'function') {
        onSelect(event)
      }
    },
    [onSelect],
  )
  const keyDownHandler = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if ((event.key === ' ' || event.key === 'Enter') && !event.defaultPrevented && typeof onSelect === 'function') {
        onSelect(event)
      }
    },
    [onSelect],
  )

  return (
    <UnderlineItem
      as="button"
      role="tab"
      tabIndex={ariaSelected ? 0 : -1}
      aria-selected={ariaSelected}
      type="button"
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
      {...props}
    />
  )
}

Tab.displayName = 'UnderlinePanels.Tab'

const Panel: FCWithSlotMarker<PanelProps> = ({children, ...rest}) => {
  return (
    <div role="tabpanel" {...rest}>
      {children}
    </div>
  )
}

Panel.displayName = 'UnderlinePanels.Panel'

export default Object.assign(UnderlinePanels, {Panel, Tab})

UnderlinePanels.__SLOT__ = Symbol('UnderlinePanels')
Tab.__SLOT__ = Symbol('UnderlinePanels.Tab')
Panel.__SLOT__ = Symbol('UnderlinePanels.Panel')
