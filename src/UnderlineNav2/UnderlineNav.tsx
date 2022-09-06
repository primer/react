import React, {useRef, forwardRef, useCallback, useState, MutableRefObject, RefObject} from 'react'
import Box from '../Box'
import {merge, SxProp, BetterSystemStyleObject} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'
import {useFocusZone} from '../hooks/useFocusZone'
import {FocusKeys} from '@primer/behaviors'

type ChildWidthArray = Array<{width: number}>
type ResponsiveProps = {
  items: Array<React.ReactElement>
  actions: Array<React.ReactElement>
  overflowStyles: React.CSSProperties
}
const overflowEffect = (
  width: number,
  childArray: Array<React.ReactElement>,
  childWidthArray: ChildWidthArray,
  noIconChildWidthArray: ChildWidthArray,
  callback: (props: ResponsiveProps, iconsVisible: boolean) => void
) => {
  let iconsVisible = true

  if (childWidthArray.length === 0) {
    callback({items: childArray, actions: [], overflowStyles: {}}, iconsVisible)
  }
  // do this only for overflow
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, width)
  const numberOfItemsWithoutIconPossible = calculatePossibleItems(noIconChildWidthArray, width)
  const items: Array<React.ReactElement> = []
  const actions: Array<React.ReactElement> = []
  const overflowStyles: React.CSSProperties = {whiteSpace: 'nowrap'}

  // First we check if we can fit all the items with icons
  if (childArray.length <= numberOfItemsPossible) {
    items.push(...childArray)
  } else if (childArray.length <= numberOfItemsWithoutIconPossible) {
    // if we can't fit all the items with icons, we check if we can fit all the items without icons
    iconsVisible = false
    items.push(...childArray)
  } else {
    iconsVisible = false
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer:coarse)').matches

    // TODO: refactor this to avoid nested if else
    if (isCoarsePointer) {
      items.push(...childArray)
      overflowStyles.overflowX = 'auto'
    } else {
      // This is only for the overflow behaviour (for fine pointers)
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

export type {ResponsiveProps}

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
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

export type UnderlineNavProps = {
  label: string
  as?: React.ElementType
  align?: 'right'
  sx?: SxProp
  variant?: 'default' | 'small'
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  children: React.ReactNode
}

export const UnderlineNav = forwardRef(
  (
    {as = 'nav', align, label, sx: sxProp = {}, afterSelect, variant = 'default', children}: UnderlineNavProps,
    forwardedRef
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const newRef = (forwardedRef ?? backupRef) as MutableRefObject<HTMLElement>

    // This might change if we decide tab through the navigation items rather than navigationg with the arrow keys.
    // TBD. In the meantime keeping it as a menu with the focus trap.
    // ref: https://www.w3.org/WAI/ARIA/apg/example-index/menubar/menubar-navigation.html (Keyboard Support)
    useFocusZone({
      containerRef: backupRef,
      bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
      focusOutBehavior: 'wrap'
    })

    const styles = {
      display: 'flex',
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      borderBottom: '1px solid',
      borderBottomColor: 'border.muted',
      align: 'row',
      alignItems: 'center'
    }

    const ulStyles = {
      display: 'flex',
      listStyle: 'none',
      padding: '0',
      margin: '0',
      marginBottom: '-1px',
      alignItems: 'center'
    }

    const [selectedLink, setSelectedLink] = useState<RefObject<HTMLElement> | undefined>(undefined)

    const [iconsVisible, setIconsVisible] = useState<boolean>(true)

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
        overflowEffect(navWidth, childArray, childWidthArray, noIconChildWidthArray, callback)
      },
      [callback, childWidthArray, noIconChildWidthArray, children]
    )
    useResizeObserver(resizeObserverCallback, newRef as RefObject<HTMLElement>)

    const dividerStyle = {
      display: 'inline-block',
      borderLeft: '1px solid',
      width: '1px',
      borderColor: 'border.muted',
      marginRight: 1
    }

    const moreBtnStyles = {
      //set margin 0 here because safari puts extra margin around the button, rest is to reset style to make it look like a list element
      margin: 0,
      border: 0,
      background: 'transparent',
      fontWeight: 'normal',
      boxShadow: 'none',
      paddingY: 1,
      paddingX: 2
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
        <Box tabIndex={0} as={as} sx={merge(styles, sxProp)} aria-label={label} ref={newRef}>
          <Box as="ul" sx={merge<BetterSystemStyleObject>(responsiveProps.overflowStyles, ulStyles)}>
            {responsiveProps.items}
          </Box>

          {actions.length > 0 && (
            <Box as="div" sx={{display: 'flex'}}>
              <Box sx={dividerStyle}></Box>
              <ActionMenu>
                <ActionMenu.Button sx={moreBtnStyles}>More</ActionMenu.Button>
                <ActionMenu.Overlay align="end">
                  <ActionList>
                    {actions.map((action, index) => {
                      const {children: actionElementChildren, ...actionElementProps} = action.props
                      return (
                        <ActionList.Item key={index} {...actionElementProps}>
                          {actionElementChildren}
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
