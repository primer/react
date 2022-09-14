import React, {
  useRef,
  useLayoutEffect,
  forwardRef,
  useCallback,
  useState,
  MutableRefObject,
  RefObject,
  useEffect
} from 'react'
import Box from '../Box'
import sx, {merge, BetterSystemStyleObject, SxProp} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys, scrollIntoView} from '@primer/behaviors'
import CounterLabel from '../CounterLabel'
import {useTheme} from '../ThemeProvider'
import {ChildWidthArray, ResponsiveProps, OnScrollWithButtonEventType} from './types'

import {moreBtnStyles, getDividerStyle, getNavStyles, ulStyles, scrollStyles, moreMenuStyles} from './styles'
import {LeftArrowButton, RightArrowButton} from './UnderlineNavArrowButton'
import styled from 'styled-components'

import type {ScrollIntoViewOptions} from '@primer/behaviors'

export type UnderlineNavProps = {
  label: string
  as?: React.ElementType
  align?: 'right'
  sx?: SxProp
  variant?: 'default' | 'small'
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  children: React.ReactNode
}

const ARROW_BTN_WIDTH = 36

const underlineNavScrollMargins: ScrollIntoViewOptions = {
  startMargin: ARROW_BTN_WIDTH,
  endMargin: ARROW_BTN_WIDTH,
  direction: 'horizontal',
  behavior: 'smooth'
}

// Needed this because passing a ref using HTMLULListElement to `Box` causes a type error
const NavigationList = styled.ul`
  ${sx};
`

const handleArrowBtnsVisibility = (
  scrollOffsets: {scrollLeft: number; scrollRight: number},
  callback: (scroll: {scrollLeft: number; scrollRight: number}) => void
) => {
  callback(scrollOffsets)
}
const overflowEffect = (
  width: number,
  childArray: Array<React.ReactElement>,
  childWidthArray: ChildWidthArray,
  noIconChildWidthArray: ChildWidthArray,
  isCoarsePointer: boolean,
  callback: (props: ResponsiveProps, iconsVisible: boolean) => void
) => {
  let iconsVisible = true
  let overflowStyles: BetterSystemStyleObject | null = {}

  if (childWidthArray.length === 0) {
    callback({items: childArray, actions: [], overflowStyles}, iconsVisible)
  }
  // do this only for overflow
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, width)
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(noIconChildWidthArray, width)
  const items: Array<React.ReactElement> = []
  const actions: Array<React.ReactElement> = []

  // First we check if we can fit all the items with icons
  if (childArray.length <= numberOfItemsPossible) {
    items.push(...childArray)
  } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
    // if we can't fit all the items with icons, we check if we can fit all the items without icons
    iconsVisible = false
    items.push(...childArray)
  } else {
    iconsVisible = false

    if (isCoarsePointer) {
      // Scroll behaviour for coarse pointer devices
      items.push(...childArray)
      overflowStyles = scrollStyles
    } else {
      // More menu behaviour for fine pointer devices
      overflowStyles = moreMenuStyles
      // if we can't fit all the items without icons, we keep the icons hidden and show the rest in the menu
      for (const [index, child] of childArray.entries()) {
        if (index < numberOfItemsWithoutIconPossible) {
          items.push(child)
        } else {
          actions.push(child)
        }
      }
    }
  }

  callback({items, actions, overflowStyles}, iconsVisible)
}

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

function calculateScrollOffset(scrollableList: RefObject<HTMLUListElement>) {
  const {scrollLeft, scrollWidth, clientWidth} = scrollableList.current as HTMLElement
  const scrollRight = scrollWidth - scrollLeft - clientWidth
  return {scrollLeft, scrollRight}
}

function calculatePossibleItems(childWidthArray: ChildWidthArray, width: number) {
  let breakpoint = childWidthArray.length - 1
  let sumsOfChildWidth = 0
  for (const [index, childWidth] of childWidthArray.entries()) {
    if (sumsOfChildWidth > 0.8 * width) {
      breakpoint = index
      break
    } else {
      sumsOfChildWidth = sumsOfChildWidth + childWidth.width
    }
  }
  return breakpoint
}

export const UnderlineNav = forwardRef(
  (
    {as = 'nav', align, label, sx: sxProp = {}, afterSelect, variant = 'default', children}: UnderlineNavProps,
    forwardedRef
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const newRef = (forwardedRef ?? backupRef) as MutableRefObject<HTMLElement>
    const listRef = useRef<HTMLUListElement>(null)

    const {theme} = useTheme()

    const [isCoarsePointer, setIsCoarsePointer] = useState(false)

    const [selectedLink, setSelectedLink] = useState<RefObject<HTMLElement> | undefined>(undefined)

    const [iconsVisible, setIconsVisible] = useState<boolean>(true)

    const [scrollValues, setScrollValues] = useState<{scrollLeft: number; scrollRight: number}>({
      scrollLeft: 0,
      scrollRight: 0
    })
    // This might change if we decide tab through the navigation items rather than navigationg with the arrow keys.
    // TBD. In the meantime keeping it as a menu with the focus trap.
    // ref: https://www.w3.org/WAI/ARIA/apg/example-index/menubar/menubar-navigation.html (Keyboard Support)
    useFocusZone({
      containerRef: backupRef,
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusOutBehavior: 'wrap'
    })

    const afterSelectHandler = (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => {
      if (!event.defaultPrevented) {
        if (typeof afterSelect === 'function') afterSelect(event)
      }
    }

    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({
      items: getValidChildren(children),
      actions: [],
      overflowStyles: {}
    })

    const callback = useCallback((props: ResponsiveProps, displayIcons: boolean) => {
      setResponsiveProps(props)
      setIconsVisible(displayIcons)
    }, [])

    const updateOffsetValues = useCallback((scrollOffsets: {scrollLeft: number; scrollRight: number}) => {
      setScrollValues(scrollOffsets)
    }, [])

    const actions = responsiveProps.actions
    const [childWidthArray, setChildWidthArray] = useState<ChildWidthArray>([])
    const setChildrenWidth = useCallback(size => {
      setChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    const [noIconChildWidthArray, setNoIconChildWidthArray] = useState<ChildWidthArray>([])
    const setNoIconChildrenWidth = useCallback(size => {
      setNoIconChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    // resizeObserver calls this function infinitely without a useCallback
    const resizeObserverCallback = useCallback(
      (resizeObserverEntries: ResizeObserverEntry[]) => {
        const childArray = getValidChildren(children)
        const navWidth = resizeObserverEntries[0].contentRect.width
        const scrollOffsets = calculateScrollOffset(listRef)

        overflowEffect(navWidth, childArray, childWidthArray, noIconChildWidthArray, isCoarsePointer, callback)

        handleArrowBtnsVisibility(scrollOffsets, updateOffsetValues)
      },
      [callback, updateOffsetValues, childWidthArray, noIconChildWidthArray, children, isCoarsePointer]
    )
    useResizeObserver(resizeObserverCallback, newRef as RefObject<HTMLElement>)

    // Determine the pointer type on mount
    useLayoutEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      setIsCoarsePointer(window.matchMedia && window.matchMedia('(pointer:coarse)').matches)
      // eslint-disable-next-line github/prefer-observers
      listRef.current?.addEventListener('scroll', () => {
        const scrollOffsets = calculateScrollOffset(listRef)

        handleArrowBtnsVisibility(scrollOffsets, updateOffsetValues)
      })
    }, [updateOffsetValues])

    useEffect(() => {
      // scroll the selected link into the view
      if (selectedLink && selectedLink.current && listRef.current) {
        scrollIntoView(selectedLink.current, listRef.current, underlineNavScrollMargins)
      }
    }, [selectedLink])

    const onScrollWithButton: OnScrollWithButtonEventType = (event, direction) => {
      if (!listRef.current) return
      const ScrollAmount = direction * 200
      listRef.current.scrollBy({left: ScrollAmount, top: 0, behavior: 'smooth'})
    }

    return (
      <UnderlineNavContext.Provider
        value={{
          setChildrenWidth,
          setNoIconChildrenWidth,
          selectedLink,
          setSelectedLink,
          afterSelect: afterSelectHandler,
          variant,
          iconsVisible
        }}
      >
        <Box
          tabIndex={0}
          as={as}
          sx={merge<BetterSystemStyleObject>(getNavStyles(theme, {align}), sxProp)}
          aria-label={label}
          ref={newRef}
        >
          <LeftArrowButton show={scrollValues.scrollLeft > 0} onScrollWithButton={onScrollWithButton} />

          <NavigationList sx={merge<BetterSystemStyleObject>(responsiveProps.overflowStyles, ulStyles)} ref={listRef}>
            {responsiveProps.items}
          </NavigationList>

          <RightArrowButton show={scrollValues.scrollRight > 0} onScrollWithButton={onScrollWithButton} />

          {actions.length > 0 && (
            <Box as="div" sx={{display: 'flex'}}>
              <Box sx={getDividerStyle(theme)}></Box>
              <ActionMenu>
                <ActionMenu.Button sx={moreBtnStyles}>More</ActionMenu.Button>
                <ActionMenu.Overlay align="end">
                  <ActionList selectionVariant="single">
                    {actions.map((action, index) => {
                      const {children: actionElementChildren, ...actionElementProps} = action.props
                      return (
                        <ActionList.Item key={index} {...actionElementProps}>
                          <Box as="span" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            {actionElementChildren}
                            <CounterLabel>{actionElementProps.counter}</CounterLabel>
                          </Box>
                        </ActionList.Item>
                      )
                    })}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </Box>
          )}
        </Box>
      </UnderlineNavContext.Provider>
    )
  }
)
