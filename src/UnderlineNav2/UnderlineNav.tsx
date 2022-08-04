import React, {useRef, forwardRef, useCallback, useState, MutableRefObject, RefObject} from 'react'
import Box from '../Box'
import {merge, SxProp, BetterSystemStyleObject} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {useResizeObserver, ResizeObserverEntry} from '../hooks/useResizeObserver'

type Overflow = 'auto' | 'menu' | 'scroll'
type ChildWidthArray = Array<{width: number}>
type ResponsiveProps = {
  items: Array<React.ReactElement>
  actions: Array<React.ReactElement>
}
const overflowEffect = (
  width: number,
  childArray: Array<React.ReactElement>,
  childWidthArray: ChildWidthArray,
  callback: (props: ResponsiveProps) => void
) => {
  if (childWidthArray.length === 0) {
    callback({items: childArray, actions: []})
  }

  // do this only for overflow
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, width)
  const items: Array<React.ReactElement> = []
  const actions: Array<React.ReactElement> = []

  for (const [index, child] of childArray.entries()) {
    if (index < numberOfItemsPossible) {
      items.push(child)
    } else {
      actions.push(child)
    }
  }
  callback({items, actions})
}

export type {ResponsiveProps}

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

function calculatePossibleItems(childWidthArray: ChildWidthArray, width: number) {
  let breakpoint = childWidthArray.length - 1
  let sumsOfChildWidth = 0
  for (const [index, childWidth] of childWidthArray.entries()) {
    if (sumsOfChildWidth > 0.5 * width) {
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
  overflow?: Overflow
  align?: 'right'
  sx?: SxProp
  afterSelect?: (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => void
  children: React.ReactNode
}

export const UnderlineNav = forwardRef(
  (
    {as = 'nav', overflow = 'auto', align, label, sx: sxProp = {}, afterSelect, children}: UnderlineNavProps,
    forwardedRef
  ) => {
    const backupRef = useRef<HTMLElement>(null)
    const newRef = (forwardedRef ?? backupRef) as MutableRefObject<HTMLElement>
    const styles = {
      display: 'flex',
      justifyContent: align === 'right' ? 'flex-end' : 'space-between',
      borderBottom: '1px solid',
      borderBottomColor: 'border.muted',
      align: 'row',
      alignItems: 'center'
    }
    const overflowStyles = overflow === 'scroll' ? {overflowX: 'auto', whiteSpace: 'nowrap'} : {}
    const ulStyles = {
      display: 'flex',
      listStyle: 'none',
      padding: '0',
      margin: '0',
      marginBottom: '-1px'
    }

    const [selectedLink, setSelectedLink] = useState<RefObject<HTMLElement> | undefined>(undefined)

    const afterSelectHandler = (event: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>) => {
      if (!event.defaultPrevented) {
        if (typeof afterSelect === 'function') afterSelect(event)
      }
    }

    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({
      items: getValidChildren(children),
      actions: []
    })

    const callback = useCallback((props: ResponsiveProps) => {
      setResponsiveProps(props)
    }, [])

    const actions = responsiveProps.actions
    const [childWidthArray, setChildWidthArray] = useState<ChildWidthArray>([])
    const setChildrenWidth = useCallback(size => {
      setChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])

    // resizeObserver calls this function infinitely without a useCallback
    const resizeObserverCallback = useCallback(
      (resizeObserverEntries: ResizeObserverEntry[]) => {
        if (overflow === 'auto' || overflow === 'menu') {
          const childArray = getValidChildren(children)
          const navWidth = resizeObserverEntries[0].contentRect.width
          overflowEffect(navWidth, childArray, childWidthArray, callback)
        }
      },
      [callback, childWidthArray, children, overflow]
    )
    useResizeObserver(resizeObserverCallback, newRef as RefObject<HTMLElement>)
    return (
      <UnderlineNavContext.Provider
        value={{setChildrenWidth, selectedLink, setSelectedLink, afterSelect: afterSelectHandler}}
      >
        <Box as={as} sx={merge(styles, sxProp)} aria-label={label} ref={newRef}>
          <Box as="ul" sx={merge<BetterSystemStyleObject>(overflowStyles, ulStyles)}>
            {responsiveProps.items}
          </Box>

          {actions.length > 0 && (
            <ActionMenu>
              <ActionMenu.Button>More</ActionMenu.Button>
              <ActionMenu.Overlay>
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
          )}
        </Box>
      </UnderlineNavContext.Provider>
    )
  }
)
