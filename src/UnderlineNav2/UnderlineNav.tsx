import React, {useRef, forwardRef, useCallback, useState, MutableRefObject, RefObject, useEffect} from 'react'
import Box from '../Box'
import sx, {merge, BetterSystemStyleObject, SxProp} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useMedia} from '../hooks/useMedia'
import {scrollIntoView} from '@primer/behaviors'
import type {ScrollIntoViewOptions} from '@primer/behaviors'
import CounterLabel from '../CounterLabel'
import {useTheme} from '../ThemeProvider'
import {ChildWidthArray, ResponsiveProps, OnScrollWithButtonEventType} from './types'

import {moreBtnStyles, getDividerStyle, getNavStyles, ulStyles, scrollStyles, moreMenuStyles} from './styles'
import {LeftArrowButton, RightArrowButton} from './UnderlineNavArrowButton'
import styled from 'styled-components'
import {LoadingCounter} from './LoadingCounter'

export type UnderlineNavProps = {
  label: string
  as?: React.ElementType
  align?: 'right'
  sx?: SxProp
  variant?: 'default' | 'small'
  /**
   * loading state for all counters (to prevent multiple layout shifts)
   */
  loadingCounters?: boolean
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  children: React.ReactNode
}
// When page is loaded, we don't have ref for the more button as it is not on the DOM yet.
// However, we need to calculate number of possible items when the more button present as well. So using the width of the more button as a constant.
const MORE_BTN_WIDTH = 86
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
  scrollableList: RefObject<HTMLUListElement>,
  callback: (scroll: {scrollLeft: number; scrollRight: number}) => void
) => {
  const {scrollLeft, scrollWidth, clientWidth} = scrollableList.current as HTMLElement
  const scrollRight = scrollWidth - scrollLeft - clientWidth
  const scrollOffsets = {scrollLeft, scrollRight}
  callback(scrollOffsets)
}
const overflowEffect = (
  navWidth: number,
  moreMenuWidth: number,
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

  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth)
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(noIconChildWidthArray, navWidth)
  // We need take more menu width into account when calculating the number of items possible
  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(
    noIconChildWidthArray,
    navWidth,
    moreMenuWidth || MORE_BTN_WIDTH
  )
  const items: Array<React.ReactElement> = []
  const actions: Array<React.ReactElement> = []

  if (isCoarsePointer) {
    // If it is a coarse pointer, we never show the icons even if they fit into the screen.
    iconsVisible = false
    items.push(...childArray)
    // If we have more items than we can fit, we add the scroll styles
    if (childArray.length > numberOfItemsWithoutIconPossible) {
      overflowStyles = scrollStyles
    }
  } else {
    // For fine pointer devices, first we check if we can fit all the items with icons
    if (childArray.length <= numberOfItemsPossible) {
      items.push(...childArray)
    } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
      // if we can't fit all the items with icons, we check if we can fit all the items without icons
      iconsVisible = false
      items.push(...childArray)
    } else {
      // if we can't fit all the items without icons, we keep the icons hidden and show the rest in the menu
      iconsVisible = false
      overflowStyles = moreMenuStyles
      for (const [index, child] of childArray.entries()) {
        if (index < numberOfItemsPossibleWithMoreMenu) {
          items.push(child)
        } else {
          actions.push(child)
        }
      }
    }
  }

  callback({items, actions, overflowStyles}, iconsVisible)
}

const getValidChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

const calculatePossibleItems = (childWidthArray: ChildWidthArray, navWidth: number, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth
  let breakpoint = childWidthArray.length - 1
  let sumsOfChildWidth = 0
  for (const [index, childWidth] of childWidthArray.entries()) {
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index - 1
      break
    } else {
      sumsOfChildWidth = sumsOfChildWidth + childWidth.width
    }
  }

  return breakpoint
}

export const UnderlineNav = forwardRef(
  (
    {
      as = 'nav',
      align,
      label,
      sx: sxProp = {},
      afterSelect,
      variant = 'default',
      loadingCounters = false,
      children
    }: UnderlineNavProps,
    forwardedRef
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const newRef = (forwardedRef ?? backupRef) as MutableRefObject<HTMLElement>
    const listRef = useRef<HTMLUListElement>(null)
    const moreMenuRef = useRef<HTMLDivElement>(null)

    const {theme} = useTheme()

    const isCoarsePointer = useMedia('(pointer: coarse)')

    const [selectedLink, setSelectedLink] = useState<RefObject<HTMLElement> | undefined>(undefined)

    const [iconsVisible, setIconsVisible] = useState<boolean>(true)

    const [scrollValues, setScrollValues] = useState<{scrollLeft: number; scrollRight: number}>({
      scrollLeft: 0,
      scrollRight: 0
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

    const scrollOnList = useCallback(() => {
      handleArrowBtnsVisibility(listRef, updateOffsetValues)
    }, [updateOffsetValues])

    const onScrollWithButton: OnScrollWithButtonEventType = (event, direction) => {
      if (!listRef.current) return
      const ScrollAmount = direction * 200
      listRef.current.scrollBy({left: ScrollAmount, top: 0, behavior: 'smooth'})
    }

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
        const moreMenuWidth = moreMenuRef.current?.getBoundingClientRect().width ?? 0
        overflowEffect(
          navWidth,
          moreMenuWidth,
          childArray,
          childWidthArray,
          noIconChildWidthArray,
          isCoarsePointer,
          callback
        )

        handleArrowBtnsVisibility(listRef, updateOffsetValues)
      },
      [callback, updateOffsetValues, childWidthArray, noIconChildWidthArray, children, isCoarsePointer, moreMenuRef]
    )

    useResizeObserver(resizeObserverCallback, newRef as RefObject<HTMLElement>)

    useEffect(() => {
      const listEl = listRef.current
      // eslint-disable-next-line github/prefer-observers
      listEl?.addEventListener('scroll', scrollOnList)
      return () => listEl?.removeEventListener('scroll', scrollOnList)
    }, [scrollOnList])

    useEffect(() => {
      // scroll the selected link into the view
      if (selectedLink && selectedLink.current && listRef.current) {
        scrollIntoView(selectedLink.current, listRef.current, underlineNavScrollMargins)
      }
    }, [selectedLink])

    return (
      <UnderlineNavContext.Provider
        value={{
          setChildrenWidth,
          setNoIconChildrenWidth,
          selectedLink,
          setSelectedLink,
          afterSelect: afterSelectHandler,
          variant,
          loadingCounters,
          iconsVisible
        }}
      >
        <Box
          as={as}
          sx={merge<BetterSystemStyleObject>(getNavStyles(theme, {align}), sxProp)}
          aria-label={label}
          ref={newRef}
        >
          {isCoarsePointer && (
            <LeftArrowButton show={scrollValues.scrollLeft > 0} onScrollWithButton={onScrollWithButton} />
          )}

          <NavigationList sx={merge<BetterSystemStyleObject>(responsiveProps.overflowStyles, ulStyles)} ref={listRef}>
            {responsiveProps.items}
          </NavigationList>

          {isCoarsePointer && (
            <RightArrowButton show={scrollValues.scrollRight > 0} onScrollWithButton={onScrollWithButton} />
          )}

          {actions.length > 0 && (
            <Box as="div" sx={{display: 'flex'}} ref={moreMenuRef}>
              <Box sx={getDividerStyle(theme)}></Box>
              <ActionMenu>
                <ActionMenu.Button sx={moreBtnStyles}>More</ActionMenu.Button>
                <ActionMenu.Overlay align="end">
                  <ActionList>
                    {actions.map((action, index) => {
                      const {children: actionElementChildren, ...actionElementProps} = action.props
                      return (
                        <ActionList.Item key={index} {...actionElementProps}>
                          <Box as="span" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            {actionElementChildren}

                            {loadingCounters ? (
                              <LoadingCounter />
                            ) : (
                              <CounterLabel>{actionElementProps.counter}</CounterLabel>
                            )}
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
