import React, {createRef, forwardRef, useCallback, useState, useContext, useLayoutEffect} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import {UnderlineNavContext} from './UnderlineNavContext'
import {ActionMenu} from '../ActionMenu'
import ActionList from '../ActionList'

/*
Todo:
1. Convert context to have array of all items
2. Convert UnderlineNav.Link to ActionList.Item
3. Calculate combined width of items to be 65% of total width available
*/
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
  overflow: 'auto' | 'menu' | 'scroll'
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
      flexDirection
    }
    const ulStyles = {
      display: 'flex',
      listStyle: 'none',
      padding: '0',
      margin: '0'
    }
    const actionStyles = {
      alignSelf: 'center'
    }

    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({items: children, actions: []})
    const [showNav, setShowNav] = useState<boolean>(false)
    const callback = useCallback(responsiveProps => {
      setResponsiveProps(responsiveProps)
      setShowNav(true)
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
    useLayoutEffect(() => {
      const domRect = newRef?.current.getBoundingClientRect()
      const width = domRect?.width || 0
      const childArray = getValidChildren(children)
      const childArraySize = childArray.length
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
          actions.push(child)
        }
      })
      callback({items, actions})
    }, [newRef.current, childWidthArray.length])

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
                <ActionList>{actions}</ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          )}
        </Box>
      </UnderlineNavContext.Provider>
    )
  }
)
