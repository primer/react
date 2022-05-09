import React, {createRef, forwardRef, useCallback, useState} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'
import useResponsiveWrapper from './useNavResponsive'
import type {ResponsiveProps} from './useNavResponsive'
import {UnderlineNavContext} from './UnderlineNavContext'

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

    const [responsiveProps, setResponsiveProps] = useState<ResponsiveProps>({items: children})
    const [showNav, setShowNav] = useState<boolean>(false)
    const callback = useCallback(responsiveProps => {
      setResponsiveProps(responsiveProps)
      setShowNav(true)
    }, [])

    const actions = responsiveProps.actions
    const [childSize, setChildSize] = useState<{width: number}>({width: 0})
    const setSize = useCallback(sizeObj => {
      if (childSize.width === 0) {
        setChildSize(sizeObj)
      }
    }, [])
    // do this for overflow
    useResponsiveWrapper({
      overflow,
      children,
      ref: newRef,
      callback: setResponsiveProps,
      childSize
    })
    // TODO - ensure horizontal scroll
    return (
      <UnderlineNavContext.Provider value={{childSize, setChildSize: setSize}}>
        <Box as={as} sx={merge(styles, sxProp)} aria-label={label} ref={newRef}>
          <Box as="ul" sx={ulStyles}>
            {responsiveProps.items}
          </Box>

          {actions && <Box sx={actionStyles}>{actions}</Box>}
        </Box>
      </UnderlineNavContext.Provider>
    )
  }
)
