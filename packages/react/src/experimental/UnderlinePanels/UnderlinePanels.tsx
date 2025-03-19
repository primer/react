import React, {
  Children,
  isValidElement,
  cloneElement,
  useState,
  useRef,
  type FC,
  type PropsWithChildren,
  useEffect,
} from 'react'
import {TabContainerElement} from '@github/tab-container-element'
import type {IconProps} from '@primer/octicons-react'
import {createComponent} from '../../utils/create-component'
import {
  StyledUnderlineItemList,
  StyledUnderlineWrapper,
  UnderlineItem,
  type UnderlineItemProps,
} from '../../internal/components/UnderlineTabbedInterface'
import Box, {type BoxProps} from '../../Box'
import {useId} from '../../hooks'
import {invariant} from '../../utils/invariant'
import {merge, type BetterSystemStyleObject, type SxProp} from '../../sx'
import {defaultSxProp} from '../../utils/defaultSxProp'
import {useResizeObserver, type ResizeObserverEntry} from '../../hooks/useResizeObserver'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'
import {useFeatureFlag} from '../../FeatureFlags'
import classes from './UnderlinePanels.module.css'
import {toggleStyledComponent} from '../../internal/utils/toggleStyledComponent'
import {clsx} from 'clsx'

const CSS_MODULES_FEATURE_FLAG = 'primer_react_css_modules_ga'

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
} & SxProp

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
}> &
  SxProp

export type PanelProps = Omit<BoxProps, 'as'>

const TabContainerComponent = createComponent(TabContainerElement, 'tab-container')

const StyledTabContainerComponent = toggleStyledComponent(
  CSS_MODULES_FEATURE_FLAG,
  'tab-container',
  TabContainerComponent,
)

const UnderlinePanels: FC<UnderlinePanelsProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  loadingCounters,
  sx: sxProp = defaultSxProp,
  className,
  ...props
}) => {
  const [iconsVisible, setIconsVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  // We need to always call useId() because React Hooks must be
  // called in the exact same order in every component render
  const parentId = useId(props.id)

  const [tabs, setTabs] = useState<React.ReactNode[]>([])
  const [tabPanels, setTabPanels] = useState<React.ReactNode[]>([])

  // Make sure we have fresh prop data whenever the tabs or panels are updated (keep aria-selected current)
  useEffect(() => {
    // Loop through the chidren, if it's a tab, then add id="{id}-tab-{index}"
    // If it's a panel, then add aria-labelledby="{id}-tab-{index}"
    let tabIndex = 0
    let panelIndex = 0

    const childrenWithProps = Children.map(children, child => {
      if (isValidElement<UnderlineItemProps>(child) && child.type === Tab) {
        return cloneElement(child, {id: `${parentId}-tab-${tabIndex++}`, loadingCounters, iconsVisible})
      }

      if (isValidElement<PanelProps>(child) && child.type === Panel) {
        return cloneElement(child, {'aria-labelledby': `${parentId}-tab-${panelIndex++}`})
      }
      return child
    })

    const newTabs = Children.toArray(childrenWithProps).filter(child => {
      return isValidElement(child) && child.type === Tab
    })

    const newTabPanels = Children.toArray(childrenWithProps).filter(
      child => isValidElement(child) && child.type === Panel,
    )

    setTabs(newTabs)
    setTabPanels(newTabPanels)
  }, [children, parentId, loadingCounters, iconsVisible])

  const tabsHaveIcons = tabs.some(tab => React.isValidElement(tab) && tab.props.icon)

  const enabled = useFeatureFlag(CSS_MODULES_FEATURE_FLAG)

  // this is a workaround to get the list's width on the first render
  const [listWidth, setListWidth] = useState(0)
  useIsomorphicLayoutEffect(() => {
    if (!tabsHaveIcons) {
      return
    }

    setListWidth(listRef.current?.getBoundingClientRect().width ?? 0)
  }, [tabsHaveIcons])

  // when the wrapper resizes, check if the icons should be visible
  // by comparing the wrapper width to the list width
  useResizeObserver(
    (resizeObserverEntries: ResizeObserverEntry[]) => {
      if (!tabsHaveIcons) {
        return
      }

      const wrapperWidth = resizeObserverEntries[0].contentRect.width

      setIconsVisible(wrapperWidth > listWidth)
    },
    wrapperRef,
    [enabled],
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

  if (enabled) {
    return (
      <StyledTabContainerComponent>
        <StyledUnderlineWrapper
          ref={wrapperRef}
          slot="tablist-wrapper"
          data-icons-visible={iconsVisible}
          sx={sxProp}
          className={clsx(className, classes.StyledUnderlineWrapper)}
          {...props}
        >
          <StyledUnderlineItemList ref={listRef} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} role="tablist">
            {tabs}
          </StyledUnderlineItemList>
        </StyledUnderlineWrapper>
        {tabPanels}
      </StyledTabContainerComponent>
    )
  }

  return (
    <StyledTabContainerComponent>
      <StyledUnderlineWrapper
        ref={wrapperRef}
        slot="tablist-wrapper"
        data-icons-visible={iconsVisible}
        sx={merge<BetterSystemStyleObject>(
          {
            width: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            '-webkit-overflow-scrolling': 'auto',
            '&[data-icons-visible="false"] [data-component="icon"]': {
              display: 'none',
            },
          },
          sxProp as SxProp,
        )}
        className={className}
        {...props}
      >
        <StyledUnderlineItemList ref={listRef} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} role="tablist">
          {tabs}
        </StyledUnderlineItemList>
      </StyledUnderlineWrapper>
      {tabPanels}
    </StyledTabContainerComponent>
  )
}

const Tab: FC<TabProps> = ({'aria-selected': ariaSelected, sx: sxProp = defaultSxProp, onSelect, ...props}) => {
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
      sx={sxProp}
      type="button"
      onClick={clickHandler}
      onKeyDown={keyDownHandler}
      {...props}
    />
  )
}

Tab.displayName = 'UnderlinePanels.Tab'

const Panel: FC<PanelProps> = props => {
  return <Box as="div" role="tabpanel" {...props} />
}

Panel.displayName = 'UnderlinePanels.Panel'

export default Object.assign(UnderlinePanels, {Panel, Tab})
