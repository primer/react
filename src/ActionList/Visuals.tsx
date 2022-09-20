import React from 'react'
import Box from '../Box'
import {SxProp, merge} from '../sx'
import {get} from '../constants'
import {getVariantStyles, Slot, ItemContext, TEXT_ROW_HEIGHT} from './shared'

type VisualProps = SxProp & React.HTMLAttributes<HTMLSpanElement>

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
          marginRight: 2
        },
        sx as SxProp
      )}
      {...props}
    />
  )
}

export type ActionListLeadingVisualProps = VisualProps
export const LeadingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({sx = {}, ...props}) => {
  return (
    <Slot name="LeadingVisual">
      {({variant, disabled}: ItemContext) => (
        <LeadingVisualContainer
          sx={merge(
            {
              color: getVariantStyles(variant, disabled).iconColor,
              svg: {fontSize: 0}
            },
            sx as SxProp
          )}
          {...props}
        >
          {props.children}
        </LeadingVisualContainer>
      )}
    </Slot>
  )
}

export type ActionListTrailingVisualProps = VisualProps
export const TrailingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({sx = {}, ...props}) => {
  return (
    <Slot name="TrailingVisual">
      {({variant, disabled}: ItemContext) => (
        <Box
          as="span"
          sx={merge(
            {
              height: '20px', // match height of text row
              flexShrink: 0,
              color: getVariantStyles(variant, disabled).annotationColor,
              marginLeft: 2,
              fontWeight: 'initial'
            },
            sx as SxProp
          )}
          {...props}
        >
          {props.children}
        </Box>
      )}
    </Slot>
  )
}
