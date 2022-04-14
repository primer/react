import React, {forwardRef} from 'react'
import Box from '../Box'
import {merge, SxProp} from '../sx'

export type UnderlineNavProps = {
  label: string
  as: 'nav' | 'div'
  align?: 'right'
  sx: SxProp
  children: React.ReactNode
  actions?: React.ComponentType
}

export const UnderlineNav = forwardRef(
  ({as = 'nav', align, label, sx: sxProp = {}, actions: Actions, children}: UnderlineNavProps, forwardedRef) => {
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

    return (
      <Box as={as} sx={merge(styles, sxProp)} aria-label={label} ref={forwardedRef}>
        <Box as="ul" sx={ulStyles}>
          {children}
        </Box>
        {Actions && (
          <Box sx={actionStyles}>
            <Actions />
          </Box>
        )}
      </Box>
    )
  }
)
