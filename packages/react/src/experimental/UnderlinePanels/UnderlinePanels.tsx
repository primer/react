import React, {
  Children,
  createContext,
  isValidElement,
  cloneElement,
  useContext,
  useState,
  useRef,
  type FC,
  type PropsWithChildren,
  useMemo,
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
import {useResizeObserver, type ResizeObserverEntry} from '../../hooks/useResizeObserver'
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

// Carries flags that affect every Tab's rendering but that don't belong on the
// consumer-facing Tab API. Passing them via context (instead of cloneElement)
// keeps each Tab element's props referentially stable across UnderlinePanels
// re-renders, so React.memo(Tab) can skip work when an unrelated piece of
// state changes.
type UnderlinePanelsContextValue = {
  iconsVisible: boolean
  loadingCounters: boolean | undefined
}
const UnderlinePanelsContext = createContext<UnderlinePanelsContextValue>({
  iconsVisible: true,
  loadingCounters: undefined,
})

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

  const [tabs, tabPanels, tabsHaveIcons] = useMemo(() => {
    // Walk children, clone each Tab with a generated id, and each Panel with a
    // matching aria-labelledby. Derive in render so we never ship a
    // "before-the-effect-ran" empty-tablist frame and so that re-renders of
    // UnderlinePanels don't churn through an extra commit cycle.
    //
    // iconsVisible / loadingCounters are NOT baked into the cloned Tab
    // elements — they flow through UnderlinePanelsContext, so this memo's deps
    // can stay tight ([children, parentId]) and Tab elements stay
    // referentially stable across resize-driven iconsVisible toggles.
    let tabIndex = 0
    let panelIndex = 0

    const childrenWithProps = Children.map(children, child => {
      if (isValidElement<UnderlineItemProps<ElementType>>(child) && (child.type === Tab || isSlot(child, Tab))) {
        return cloneElement(child, {id: `${parentId}-tab-${tabIndex++}`})
      }

      if (isValidElement<PanelProps>(child) && (child.type === Panel || isSlot(child, Panel))) {
        const childPanel = child as React.ReactElement<PanelProps>
        return cloneElement(childPanel, {'aria-labelledby': `${parentId}-tab-${panelIndex++}`})
      }
      return child
    })

    const tabs: React.ReactNode[] = []
    const tabPanels: React.ReactNode[] = []
    for (const child of Children.toArray(childrenWithProps)) {
      if (!isValidElement(child)) continue
      if (child.type === Tab || isSlot(child, Tab)) tabs.push(child)
      else if (child.type === Panel || isSlot(child, Panel)) tabPanels.push(child)
    }

    const tabsHaveIcons = tabs.some(tab => React.isValidElement(tab) && tab.props.icon)

    return [tabs, tabPanels, tabsHaveIcons] as const
  }, [children, parentId])

  const contextValue = useMemo<UnderlinePanelsContextValue>(
    () => ({iconsVisible, loadingCounters}),
    [iconsVisible, loadingCounters],
  )

  // The list's natural width (icons + labels). Used only inside the resize
  // observer to decide whether to show or hide the icons — never read in
  // render — so it lives in a ref to avoid an extra commit on mount and on
  // every list resize.
  const listWidthRef = useRef(0)
  useIsomorphicLayoutEffect(() => {
    if (!tabsHaveIcons) {
      return
    }

    listWidthRef.current = listRef.current?.getBoundingClientRect().width ?? 0
  }, [tabsHaveIcons])

  // when the wrapper resizes, check if the icons should be visible
  // by comparing the wrapper width to the list width
  useResizeObserver(
    (resizeObserverEntries: ResizeObserverEntry[]) => {
      if (!tabsHaveIcons) {
        return
      }

      const wrapperWidth = resizeObserverEntries[0].contentRect.width

      setIconsVisible(wrapperWidth > listWidthRef.current)
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
    <UnderlinePanelsContext.Provider value={contextValue}>
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
    </UnderlinePanelsContext.Provider>
  )
}

const TabImpl: FCWithSlotMarker<TabProps> = ({'aria-selected': ariaSelected, onSelect, ...props}) => {
  const {iconsVisible, loadingCounters} = useContext(UnderlinePanelsContext)
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
      iconsVisible={iconsVisible}
      loadingCounters={loadingCounters}
      {...props}
    />
  )
}

// Memoized so that UnderlinePanels re-rendering (e.g. when iconsVisible flips)
// only re-renders Tabs whose own props actually changed. iconsVisible and
// loadingCounters reach Tab via UnderlinePanelsContext, so Tabs still react
// to those changes through context propagation.
TabImpl.displayName = 'UnderlinePanels.Tab'
const Tab = React.memo(TabImpl) as unknown as FCWithSlotMarker<TabProps>

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
