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
} from 'react'
import type {IconProps} from '@primer/octicons-react'
import {UnderlineItemList, UnderlineWrapper, UnderlineItem} from '../../internal/components/UnderlineTabbedInterface'
import {useId} from '../../hooks'
import {invariant} from '../../utils/invariant'
import {useFeatureFlag} from '../../FeatureFlags'
import {warning} from '../../utils/warning'
import {useResizeObserver, type ResizeObserverEntry} from '../../hooks/useResizeObserver'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import classes from './UnderlinePanels.module.css'
import {clsx} from 'clsx'
import {isSlot} from '../../utils/is-slot'
import type {FCWithSlotMarker} from '../../utils/types'
import {Tabs, useTab, useTabList, useTabPanel} from '../Tabs'
import type {TabListHookProps} from '../Tabs/types'

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
   * The value of the selected tab, keyed to each `UnderlinePanels.Tab`/`UnderlinePanels.Panel`
   * `value`. Provide this (with `onChange`) for a controlled component where the selected tab is
   * the single source of truth.
   */
  value?: string
  /**
   * The value of the tab that should be selected by default, keyed to each tab's `value`. Use this
   * for an uncontrolled component. Cannot be combined with `value`.
   */
  defaultValue?: string
  /**
   * Fires whenever the selected tab changes, for every selection method including arrow keys.
   * Unlike `UnderlinePanels.Tab`'s `onSelect`, which only fires on click and Enter/Space.
   */
  onChange?: ({value}: {value: string}) => void
  /**
   * `'automatic'` (default) selects on focus/arrow keys; `'manual'` only moves focus until
   * Enter/Space/click. Prefer `'manual'` when displaying a panel is not instant.
   */
  activationMode?: 'automatic' | 'manual'
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
   * A value that uniquely identifies this tab, paired with the `UnderlinePanels.Panel` of the same
   * `value`. Provide this to use domain values (e.g. `'branch'`) with the container's controlled
   * `value`/`onChange` API. When omitted, tabs and panels are paired by their DOM order.
   */
  value?: string
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

export type PanelProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * A value that uniquely identifies this panel, paired with the `UnderlinePanels.Tab` of the same
   * `value`. When omitted, tabs and panels are paired by their DOM order.
   */
  value?: string
}

// Explicit consumer `value`, or a positional fallback pairing the Nth tab with the Nth panel.
type WithValue = {value?: string}

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
  value: valueProp,
  defaultValue: defaultValueProp,
  onChange: onChangeProp,
  activationMode = 'automatic',
  ...props
}) => {
  // Feature-flag scaffolding: at graduation, drop these three and use the props directly.
  const controlledApiEnabled = useFeatureFlag('primer_react_underline_panels_controlled')
  const controlledValue = controlledApiEnabled ? valueProp : undefined
  const defaultValue = controlledApiEnabled ? defaultValueProp : undefined
  const onChange = controlledApiEnabled ? onChangeProp : undefined

  const [iconsVisible, setIconsVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  // We need to always call useId() because React Hooks must be
  // called in the exact same order in every component render
  const parentId = useId(props.id)

  const [tabs, tabPanels, tabsHaveIcons, selectedFromProps, tabValues, panelValues] = useMemo(() => {
    // Derived in render (not an effect) to avoid an empty-tablist frame.
    let tabIndex = 0
    let panelIndex = 0

    const childrenWithProps = Children.map(children, child => {
      if (isValidElement<TabProps & WithValue>(child) && (child.type === Tab || isSlot(child, Tab))) {
        const value = (controlledApiEnabled ? child.props.value : undefined) ?? `${tabIndex}`
        tabIndex++
        return cloneElement(child, {value})
      }

      if (isValidElement<PanelProps & WithValue>(child) && (child.type === Panel || isSlot(child, Panel))) {
        const value = (controlledApiEnabled ? child.props.value : undefined) ?? `${panelIndex}`
        panelIndex++
        return cloneElement(child, {value})
      }
      return child
    })

    const tabs: React.ReactNode[] = []
    const tabPanels: React.ReactNode[] = []
    const tabValues: string[] = []
    const panelValues: string[] = []
    let selectedFromProps: string | undefined
    for (const child of Children.toArray(childrenWithProps)) {
      if (!isValidElement(child)) continue
      if (child.type === Tab || isSlot(child, Tab)) {
        const value = (child.props as WithValue).value
        if (value !== undefined) tabValues.push(value)
        const ariaSelected = (child.props as {'aria-selected'?: boolean | string})['aria-selected']
        if (ariaSelected === true || ariaSelected === 'true') {
          selectedFromProps = value
        }
        tabs.push(child)
      } else if (child.type === Panel || isSlot(child, Panel)) {
        const value = (child.props as WithValue).value
        if (value !== undefined) panelValues.push(value)
        tabPanels.push(child)
      }
    }

    const tabsHaveIcons = tabs.some(tab => React.isValidElement(tab) && tab.props.icon)

    return [tabs, tabPanels, tabsHaveIcons, selectedFromProps, tabValues, panelValues] as const
  }, [children, controlledApiEnabled])

  // Hand-rolled rather than `useControllableState` because of the third, back-compat
  // `aria-selected` seed, which is re-synced during render.
  const isControlled = controlledValue !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => defaultValue ?? selectedFromProps ?? '0')
  const [prevSelectedFromProps, setPrevSelectedFromProps] = useState(selectedFromProps)
  if (!isControlled && selectedFromProps !== prevSelectedFromProps) {
    setPrevSelectedFromProps(selectedFromProps)
    if (selectedFromProps !== undefined && selectedFromProps !== uncontrolledValue) {
      setUncontrolledValue(selectedFromProps)
    }
  }

  const selectedValue = isControlled ? controlledValue : uncontrolledValue

  // Fall back to the first tab when the value matches none, so the tablist keeps a tabbable
  // entry point. Does not fire `onChange`.
  const effectiveValue = tabValues.includes(selectedValue) ? selectedValue : (tabValues[0] ?? selectedValue)

  const handleValueChange = (value: string) => {
    if (!isControlled) {
      setUncontrolledValue(value)
    }
    onChange?.({value})
  }

  const {tabListProps} = useTabList<HTMLUListElement>({
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ref: listRef,
  } as TabListHookProps<HTMLUListElement>)

  const contextValue = useMemo<UnderlinePanelsContextValue>(
    () => ({iconsVisible, loadingCounters}),
    [iconsVisible, loadingCounters],
  )

  // Mirror iconsVisible into a ref so the list observer below can read it
  // without being re-created on every toggle (re-creating the observer
  // would re-trigger its initial callback and churn extra work).
  const iconsVisibleRef = useRef(iconsVisible)
  useIsomorphicLayoutEffect(() => {
    iconsVisibleRef.current = iconsVisible
  }, [iconsVisible])

  // The list's natural width (icons + labels), kept in sync via a
  // ResizeObserver on the list — never read in render, so updates don't
  // cause commits. Only refreshed while icons are visible: when icons are
  // hidden the list is at its compressed width, which is not the value we
  // want to compare against. The ResizeObserver fires synchronously on
  // observe, which seeds the ref on mount for free.
  const listWidthRef = useRef(0)
  useResizeObserver(
    (entries: ResizeObserverEntry[]) => {
      if (!tabsHaveIcons) return
      if (!iconsVisibleRef.current) return
      listWidthRef.current = entries[0].contentRect.width
    },
    listRef,
    [],
  )

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

    // Structural problems throw; recoverable misconfiguration warns.
    invariant(selectedTabs.length <= 1, 'Only one tab can be selected at a time.')

    invariant(
      tabs.length === tabPanels.length,
      `The number of tabs and panels must be equal. Counted ${tabs.length} tabs and ${tabPanels.length} panels.`,
    )

    // Tab and panel ids are derived from `value`, so duplicates would collide.
    const duplicateTabValue = tabValues.find((value, index) => tabValues.indexOf(value) !== index)
    invariant(
      duplicateTabValue === undefined,
      `Every tab must have a unique \`value\`. Found duplicate "${duplicateTabValue}".`,
    )
    const duplicatePanelValue = panelValues.find((value, index) => panelValues.indexOf(value) !== index)
    invariant(
      duplicatePanelValue === undefined,
      `Every panel must have a unique \`value\`. Found duplicate "${duplicatePanelValue}".`,
    )

    const unmatchedTabValue = tabValues.find(value => !panelValues.includes(value))
    invariant(
      unmatchedTabValue === undefined,
      `Tab with \`value\` "${unmatchedTabValue}" has no matching panel. Give a \`UnderlinePanels.Panel\` the same \`value\`.`,
    )

    warning(
      isControlled && selectedTabs.length > 0,
      'UnderlinePanels: do not combine the controlled `value` prop with `aria-selected` on a tab. `value` takes precedence; use `value`/`onChange` (or `defaultValue`) to drive selection.',
    )

    warning(
      controlledValue !== undefined && defaultValue !== undefined,
      'UnderlinePanels: do not combine the controlled `value` prop with `defaultValue`. `value` takes precedence; use one or the other.',
    )

    // Already clamped to the first tab above; warn since it's rarely intended.
    const providedValue = controlledValue ?? defaultValue
    warning(
      providedValue !== undefined && tabValues.length > 0 && !tabValues.includes(providedValue),
      `UnderlinePanels: the selected value "${providedValue}" does not match any tab, so the first tab is selected instead. Provide a \`value\`/\`defaultValue\` that matches a \`UnderlinePanels.Tab\` \`value\`.`,
    )
  }

  return (
    <UnderlinePanelsContext.Provider value={contextValue}>
      <Tabs
        id={parentId}
        value={effectiveValue}
        activationMode={activationMode}
        onValueChange={({value}) => handleValueChange(value)}
      >
        <UnderlineWrapper
          ref={wrapperRef}
          data-icons-visible={iconsVisible}
          className={clsx(className, classes.StyledUnderlineWrapper)}
          {...props}
        >
          <UnderlineItemList
            ref={listRef}
            role={tabListProps.role}
            aria-label={tabListProps['aria-label']}
            aria-labelledby={tabListProps['aria-labelledby']}
            aria-orientation={tabListProps['aria-orientation']}
            onKeyDown={tabListProps.onKeyDown}
          >
            {tabs}
          </UnderlineItemList>
        </UnderlineWrapper>
        {tabPanels}
      </Tabs>
    </UnderlinePanelsContext.Provider>
  )
}

const TabImpl: FC<TabProps & WithValue> = ({onSelect, value, ...itemProps}) => {
  const {loadingCounters} = useContext(UnderlinePanelsContext)
  const {tabProps} = useTab<HTMLButtonElement>({value: value ?? ''})
  const {onKeyDown: tabOnKeyDown, onMouseDown: tabOnMouseDown, onFocus: tabOnFocus, ...restTabProps} = tabProps

  return (
    <UnderlineItem
      as="button"
      {...itemProps}
      {...restTabProps}
      type="button"
      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
        if (!event.defaultPrevented && typeof onSelect === 'function') {
          onSelect(event)
        }
      }}
      onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
        tabOnKeyDown?.(event)
        if ((event.key === ' ' || event.key === 'Enter') && !event.defaultPrevented && typeof onSelect === 'function') {
          onSelect(event)
        }
      }}
      onMouseDown={tabOnMouseDown}
      onFocus={tabOnFocus}
      loadingCounters={loadingCounters}
    />
  )
}

// Memoized so an UnderlinePanels re-render (e.g. iconsVisible flipping) only
// re-renders Tabs whose own props changed; iconsVisible/loadingCounters reach
// Tab via context.
TabImpl.displayName = 'UnderlinePanels.Tab'
const Tab = React.memo(TabImpl) as unknown as FCWithSlotMarker<TabProps>

Tab.displayName = 'UnderlinePanels.Tab'

const PanelImpl: FC<PanelProps & WithValue> = ({children, value, ...panelRest}) => {
  const {tabPanelProps} = useTabPanel<HTMLDivElement>({value: value ?? ''})

  return (
    <div {...panelRest} {...tabPanelProps}>
      {children}
    </div>
  )
}

PanelImpl.displayName = 'UnderlinePanels.Panel'
const Panel = PanelImpl as unknown as FCWithSlotMarker<PanelProps>

Panel.displayName = 'UnderlinePanels.Panel'

export default Object.assign(UnderlinePanels, {Panel, Tab})

Tab.__SLOT__ = Symbol('UnderlinePanels.Tab')
Panel.__SLOT__ = Symbol('UnderlinePanels.Panel')
