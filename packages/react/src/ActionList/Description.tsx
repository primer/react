import React from 'react'
import Box from '../Box'
import Truncate from '../Truncate'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {ItemContext} from './shared'

export type ActionListDescriptionProps = {
  /**
   * Secondary text style variations.
   *
   * - `"inline"` - Secondary text is positioned beside primary text.
   * - `"block"` - Secondary text is positioned below primary text.
   */
  variant?: 'inline' | 'block'
  className?: string
  /**
   * Whether the inline description should truncate the text on overflow.
   */
  truncate?: boolean
} & SxProp

export const Description: React.FC<React.PropsWithChildren<ActionListDescriptionProps>> = ({
  variant = 'inline',
  sx = {},
  className,
  truncate,
  ...props
}) => {
  const styles = {
    fontSize: 0,
    lineHeight: '16px',
    flexGrow: 1,
    flexBasis: variant === 'inline' && !truncate ? 'auto' : 0,
    minWidth: 0,
    marginLeft: variant === 'block' ? 0 : 2,
    color: 'fg.muted',
    'li[aria-disabled="true"] &[data-component="ActionList.Description"]': {color: 'inherit'},
    'li[data-variant="danger"]:hover &[data-component="ActionList.Description"], li[data-variant="danger"]:active &[data-component="ActionList.Description"]':
      {color: 'inherit'},
  }

  const {blockDescriptionId, inlineDescriptionId} = React.useContext(ItemContext)

  return variant === 'block' || !truncate ? (
    <Box
      as="span"
      sx={merge(styles, sx as SxProp)}
      id={variant === 'block' ? blockDescriptionId : inlineDescriptionId}
      className={className}
      data-component="ActionList.Description"
      title={props.children as string}
    >
      {props.children}
    </Box>
  ) : (
    <Truncate
      id={inlineDescriptionId}
      className={className}
      sx={merge(styles, sx as SxProp)}
      title={props.children as string}
      inline={true}
      maxWidth="100%"
      data-component="ActionList.Description"
    >
      {props.children}
    </Truncate>
  )
}
