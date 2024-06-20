import React, {Children, isValidElement, cloneElement, useState, useRef, type FC, type PropsWithChildren} from 'react'
import {TabContainerElement} from '@github/tab-container-element'
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
import type {IconProps} from '@primer/octicons-react'
import {merge, type BetterSystemStyleObject, type SxProp} from '../../sx'
import {defaultSxProp} from '../../utils/defaultSxProp'
import {useResizeObserver, type ResizeObserverEntry} from '../../hooks/useResizeObserver'
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

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
} & SxProp

export type TabProps = PropsWithChildren<{
  /**
   * Whether this is the selected tab
   */
  'aria-selected'?: boolean
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

const UnderlinePanels: FC<UnderlinePanelsProps> = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  loadingCounters,
  sx: sxProp = defaultSxProp,
  ...props
}) => {
  const [iconsVisible, setIconsVisible] = useState(true)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  // We need to always call useId() because React Hooks must be
  // called in the exact same order in every component render
  const parentId = useId(props.id)

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

  // `tabs` and `tabPanels` need to be refs because `child.type === {type}` will become false
  // after the elements are cloned by `childrenWithProps` on the first render
  const tabs = useRef(
    Children.toArray(childrenWithProps).filter(child => {
      return isValidElement(child) && child.type === Tab
    }),
  )
  const tabPanels = useRef(
    Children.toArray(childrenWithProps).filter(child => isValidElement(child) && child.type === Panel),
  )
  const tabsHaveIcons = tabs.current.some(tab => React.isValidElement(tab) && tab.props.icon)

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
  useResizeObserver((resizeObserverEntries: ResizeObserverEntry[]) => {
    if (!tabsHaveIcons) {
      return
    }

    const wrapperWidth = resizeObserverEntries[0].contentRect.width

    setIconsVisible(wrapperWidth > listWidth)
  }, wrapperRef)

  if (__DEV__) {
    // only one tab can be selected at a time
    const selectedTabs = tabs.current.filter(tab => {
      const ariaSelected = React.isValidElement(tab) && tab.props['aria-selected']

      return ariaSelected === true || ariaSelected === 'true'
    })

    invariant(selectedTabs.length <= 1, 'Only one tab can be selected at a time.')

    // every tab has its panel
    invariant(
      tabs.current.length === tabPanels.current.length,
      `The number of tabs and panels must be equal. Counted ${tabs.current.length} tabs and ${tabPanels.current.length} panels.`,
    )
  }

  return (
    <TabContainerComponent>
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
        {...props}
      >
        <StyledUnderlineItemList ref={listRef} aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} role="tablist">
          {tabs.current}
        </StyledUnderlineItemList>
      </StyledUnderlineWrapper>
      {tabPanels.current}
    </TabContainerComponent>
  )
}

const Tab: FC<TabProps> = ({'aria-selected': ariaSelected, sx: sxProp = defaultSxProp, ...props}) => (
  <UnderlineItem
    as="button"
    role="tab"
    tabIndex={ariaSelected ? 0 : -1}
    aria-selected={ariaSelected}
    sx={sxProp}
    {...props}
  />
)

Tab.displayName = 'UnderlinePanels.Tab'

const Panel: FC<PanelProps> = props => {
  return <Box as="div" role="tabpanel" {...props} />
}

Panel.displayName = 'UnderlinePanels.Panel'

export default Object.assign(UnderlinePanels, {Panel, Tab})
