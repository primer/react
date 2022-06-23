import React, {useRef, forwardRef, useCallback, useState, useLayoutEffect, MutableRefObject} from 'react'
import Box from '../Box'
import {merge, SxProp, BetterSystemStyleObject} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {ActionMenu} from '../ActionMenu'
import {ActionList} from '../ActionList'
import {useResizeObserver} from '../hooks/useResizeObserver'

/*
Todo:
1. Convert context to have array of all items = done
2. Convert UnderlineNav.Link to ActionList.Item - done
3. Calculate combined width of items to be 50% of total width available - done
4. fix the dropdown button - done
5. figure out horizontal scroll - done
6. Overflow on resize - done
7. Performance is wack!
7. pass typescript
8. write tests
*/

type Overflow = 'auto' | 'menu' | 'scroll'
type ChildWidthArray = Array<{width: number}>
type ResponsiveProps = {
  items: Array<React.ReactElement>
  actions: Array<React.ReactElement>
}
const overflowEffect = (
  newRef: MutableRefObject<HTMLElement>,
  childArray: Array<React.ReactElement>,
  childWidthArray: ChildWidthArray,
  callback: (props: ResponsiveProps) => void
) => {
  const domRect = newRef.current.getBoundingClientRect()
  const width = domRect.width || 0

  if (childWidthArray.length === 0) {
    callback({items: childArray, actions: []})
  }

  // do this only for overflow
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, width)
  const items: Array<React.ReactElement> = []
  const actions: Array<React.ReactElement> = []

  // eslint-disable-next-line github/array-foreach
  childArray.forEach((child: React.ReactElement, index: number) => {
    if (index < numberOfItemsPossible) {
      items.push(child)
    } else {
      actions.push(child)
    }
  })
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
  as: React.ElementType
  overflow: Overflow
  align?: 'right'
  sx: SxProp
  children: React.ReactNode
}

export const UnderlineNav = forwardRef(
  ({as = 'nav', overflow = 'auto', align, label, sx: sxProp = {}, children}: UnderlineNavProps, forwardedRef) => {
    const backupRef = useRef<HTMLElement>(null)
    const newRef = forwardedRef ?? backupRef
    const flexDirection = align === 'right' ? 'row-reverse' : 'row'
    const styles = {
      display: 'flex',
      justifyContent: 'space-between',
      boxShadow: 'inset 0 -1px 0',
      boxShadowColor: 'fg.muted',
      flexDirection,
      alignItems: 'center'
    }
    const overflowStyles = overflow === 'scroll' ? {overflowX: 'auto', whiteSpace: 'nowrap'} : {}
    const ulStyles = {
      display: 'flex',
      listStyle: 'none',
      padding: '0',
      margin: '0'
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

    useLayoutEffect(() => {
      if (overflow === 'auto' || overflow === 'menu') {
        const childArray = getValidChildren(children)
        overflowEffect(newRef as MutableRefObject<HTMLElement>, childArray, childWidthArray, callback)
      }
    }, [childWidthArray.length, overflow, newRef, callback, children, childWidthArray])

    useResizeObserver(() => {
      if (overflow === 'auto' || overflow === 'menu') {
        const childArray = getValidChildren(children)
        overflowEffect(newRef as MutableRefObject<HTMLElement>, childArray, childWidthArray, callback)
      }
    })

    return (
      <UnderlineNavContext.Provider value={{setChildrenWidth}}>
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
