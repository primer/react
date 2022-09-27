import React from 'react'
import Box from '../Box'
import {SxProp, merge} from '../sx'
import Truncate from '../Truncate'
import {Slot, ItemContext} from './shared'

export type ActionListDescriptionProps = {
  /**
   * Secondary text style variations.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  variant?: 'inline' | 'block'
} & SxProp

export const Description: React.FC<React.PropsWithChildren<ActionListDescriptionProps>> = ({
  variant = 'inline',
  sx = {},
  ...props
}) => {
  const styles = {
    fontSize: 0,
    lineHeight: '16px',
    flexGrow: 1,
    flexBasis: 0,
    minWidth: 0,
    marginLeft: variant === 'block' ? 0 : 2
  }

  return (
    <Slot name={variant === 'block' ? 'BlockDescription' : 'InlineDescription'}>
      {({blockDescriptionId, inlineDescriptionId, disabled}: ItemContext) =>
        variant === 'block' ? (
          <Box
            as="span"
            sx={merge({...styles, color: disabled ? 'fg.disabled' : 'fg.muted'}, sx as SxProp)}
            id={blockDescriptionId}
          >
            {props.children}
          </Box>
        ) : (
          <Truncate
            id={inlineDescriptionId}
            sx={merge({...styles, color: disabled ? 'fg.disabled' : 'fg.muted'}, sx as SxProp)}
            title={props.children as string}
            inline={true}
            maxWidth="100%"
          >
            {props.children}
          </Truncate>
        )
      }
    </Slot>
  )
}
