import React from 'react'
import Box from '../Box'
import {get} from '../constants'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {ItemContext, TEXT_ROW_HEIGHT, getVariantStyles} from './shared'

export type VisualProps = SxProp & React.HTMLAttributes<HTMLSpanElement>

export const LeadingVisualContainer: React.FC<React.PropsWithChildren<VisualProps>> = ({sx = {}, ...props}) => {
  return (
    <Box
      as="span"
      sx={merge(
        {
          height: TEXT_ROW_HEIGHT, // match height of text row
          minWidth: get('space.3'),
          maxWidth: TEXT_ROW_HEIGHT, // square (same as height)
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
          marginRight: 2,
        },
        sx as SxProp,
      )}
      {...props}
    />
  )
}

export type ActionListLeadingVisualProps = VisualProps
export const LeadingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({sx = {}, ...props}) => {
  const {variant, disabled, inactive} = React.useContext(ItemContext)
  return (
    <LeadingVisualContainer
      sx={merge(
        {
          color: getVariantStyles(variant, disabled, inactive).iconColor,
          svg: {fontSize: 0},
          '[data-variant="danger"]:not([aria-disabled]):not([data-inactive]):hover &, [data-variant="danger"]:active &':
            {
              color: getVariantStyles(variant, disabled, inactive).hoverColor,
            },
        },
        sx as SxProp,
      )}
      {...props}
    >
      {props.children}
    </LeadingVisualContainer>
  )
}

export type ActionListTrailingVisualProps = VisualProps
export const TrailingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({sx = {}, ...props}) => {
  const {variant, disabled, inactive} = React.useContext(ItemContext)
  return (
    <Box
      as="span"
      sx={merge(
        {
          height: '20px', // match height of text row
          flexShrink: 0,
          color: getVariantStyles(variant, disabled, inactive).annotationColor,
          marginLeft: 2,
          fontWeight: 'initial',
          '[data-variant="danger"]:hover &, [data-variant="danger"]:active &': {
            color: getVariantStyles(variant, disabled, inactive).hoverColor,
          },
        },
        sx as SxProp,
      )}
      {...props}
    >
      {props.children}
    </Box>
  )
}
