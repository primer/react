import React, {createRef, forwardRef, useCallback, useState, useLayoutEffect} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'
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

const overflowEffect = (newRef, childArray, childWidthArray, callback) => {
  const domRect = newRef.getBoundingClientRect()
  const width = domRect?.width || 0

  if (childWidthArray.length === 0) {
    callback({items: childArray, actions: []})
  }

  // do this only for overflow
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, width)
  const items = []
  const actions = []

  childArray.forEach((child, index) => {
    if (index < numberOfItemsPossible) {
      items.push(child)
    } else {
      actions.push(child.props)
    }
  })
  callback({items, actions})
}
type Overflow = 'auto' | 'menu' | 'scroll'
type ResponsiveProps = {
  items: Array<React.ReactNode>
  actions: Array<React.ReactNode>
}

export type {ResponsiveProps}

function getValidChildren(children: React.ReactNode) {
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement[]
}

function calculatePossibleItems(childWidthArray, width) {
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
    const newRef = forwardedRef ?? createRef()
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
      margin: '0',
      ...overflowStyles
    }

    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({items: children, actions: []})
    const callback = useCallback(responsiveProps => {
      setResponsiveProps(responsiveProps)
    }, [])

    const actions = responsiveProps.actions
    const [childWidthArray, setChildWidthArray] = useState([])
    const setChildrenWidth = useCallback(size => {
      setChildWidthArray(arr => {
        const newArr = [...arr, size]
        return newArr
      })
    }, [])
    // do this for overflow
    const childArray = getValidChildren(children)
    useLayoutEffect(() => {
      if (overflow === 'auto' || overflow === 'menu') {
        overflowEffect(newRef?.current, childArray, childWidthArray, callback)
      }
    }, [newRef?.current, childWidthArray.length])

    useResizeObserver(() => overflowEffect(newRef?.current, childArray, childWidthArray, callback))
    // TODO - ensure horizontal scroll
    return (
      <UnderlineNavContext.Provider value={{setChildrenWidth}}>
        <Box as={as} sx={merge(styles, sxProp)} aria-label={label} ref={newRef}>
          <Box as="ul" sx={ulStyles}>
            {responsiveProps.items}
          </Box>

          {actions.length > 0 && (
            <ActionMenu>
              <ActionMenu.Button>Hidden</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  {actions.map((action, index) => {
                    const {children, ...props} = action
                    return (
                      <ActionList.Item key={index} {...props}>
                        {children}
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
