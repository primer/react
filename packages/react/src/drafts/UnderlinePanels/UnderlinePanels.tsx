import React, {
  Children,
  isValidElement,
  cloneElement,
  useState,
  useRef,
  type FC,
  type PropsWithChildren,
  useLayoutEffect,
} from 'react'
import {TabContainerElement} from '@github/tab-container-element'
import createComponent from '../../utils/custom-element'
import {
  StyledUnderlineTabList,
  StyledUnderlineWrapper,
  UnderlineTab,
  type UnderlineTabProps,
} from '../../internal/components/UnderlineTabbedInterface'
import {useId} from '../../hooks'
import {invariant} from '../../utils/invariant'
import type {IconProps} from '@primer/octicons-react'
import {merge, type BetterSystemStyleObject, type SxProp} from '../../sx'
import {defaultSxProp} from '../../utils/defaultSxProp'
import {useResizeObserver, type ResizeObserverEntry} from '../../hooks/useResizeObserver'

type UnderlineTabButtonProps = {
  /**
   * Whether this is the selected tab
   */
  'aria-selected'?: boolean
  counter?: number | string
  icon?: FC<IconProps>
} & SxProp

type UnderlineTabbedInterfaceProps = {
  children: React.ReactNode
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
  as?: React.ElementType
  loadingCounters?: boolean
  id?: string
} & SxProp

const TabContainerComponent = createComponent(TabContainerElement, 'tab-container')

const UnderlinePanels: FC<PropsWithChildren<UnderlineTabbedInterfaceProps>> = ({
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
  const defaultId = useId()
  const parentId = props.id ?? defaultId

  // Loop through the chidren, if it's a tab, then add id="{id}-tab-{index}"
  // If it's a panel, then add aria-labelledby="{id}-tab-{index}"
  let tabIndex = 0
  let panelIndex = 0

  const childrenWithProps = Children.map(children, child => {
    if (isValidElement<UnderlineTabProps>(child) && child.type === Tab) {
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
  useLayoutEffect(() => {
    if (!tabsHaveIcons) {
      return
    }

    setListWidth(listRef.current?.getBoundingClientRect().width ?? 0)
  }, [])

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
      tabs.current?.length === tabPanels.current?.length,
      `The number of tabs and panels must be equal. Counted ${tabs.current?.length} tabs and ${tabPanels.current?.length} panels.`,
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
        <StyledUnderlineTabList ref={listRef} role="tablist">
          {tabs.current}
        </StyledUnderlineTabList>
      </StyledUnderlineWrapper>
      {tabPanels.current}
    </TabContainerComponent>
  )
}

type TabProps = PropsWithChildren<UnderlineTabButtonProps>

const Tab: FC<TabProps> = ({'aria-selected': ariaSelected, sx: sxProp = defaultSxProp, ...props}) => {
  const tabIndex = ariaSelected ? 0 : -1

  return <UnderlineTab as="button" role="tab" tabIndex={tabIndex} aria-selected={ariaSelected} sx={sxProp} {...props} />
}

Tab.displayName = 'UnderlinePanels.Tab'

type PanelProps = PropsWithChildren<Omit<React.HTMLProps<HTMLDivElement>, 'role'>>

const Panel: FC<PanelProps> = props => {
  return <div role="tabpanel" {...props} />
}

Panel.displayName = 'UnderlinePanels.Panel'

export default Object.assign(UnderlinePanels, {Panel, Tab})
