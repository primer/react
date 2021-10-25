import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {get} from '../constants'
import {getVariantStyles, Slot, ItemContext} from './Item'

type VisualProps = SxProp & {children: React.ReactNode}

export const LeadingVisualContainer: React.FC<SxProp> = ({sx = {}, ...props}) => {
  return (
    <Box
      as="span"
      sx={{
        height: '20px', // match height of text row
        minWidth: get('space.3'),
        maxWidth: '20px', // square (same as height)
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        marginRight: 2,
        ...sx
      }}
      {...props}
    />
  )
}

export type LeadingVisualProps = VisualProps
export const LeadingVisual: React.FC<VisualProps> = ({sx = {}, ...props}) => {
  return (
    <Slot name="LeadingVisual">
      {({variant, disabled}: ItemContext) => (
        <LeadingVisualContainer
          sx={{
            color: getVariantStyles(variant, disabled).iconColor,
            svg: {fontSize: 0},
            ...sx
          }}
          {...props}
        >
          {props.children}
        </LeadingVisualContainer>
      )}
    </Slot>
  )
}

export type TrailingVisualProps = VisualProps
export const TrailingVisual: React.FC<VisualProps> = ({sx = {}, ...props}) => {
  return (
    <Slot name="TrailingVisual">
      {({variant, disabled}: ItemContext) => (
        <Box
          as="span"
          sx={{
            height: '20px', // match height of text row
            flexShrink: 0,
            color: getVariantStyles(variant, disabled).annotationColor,
            marginLeft: 2,
            ...sx
          }}
          {...props}
        >
          {props.children}
        </Box>
      )}
    </Slot>
  )
}
