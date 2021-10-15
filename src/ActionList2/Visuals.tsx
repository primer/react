import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {get} from '../constants'
import {ItemProps, getVariantStyles} from './Item'

type VisualProps = Pick<ItemProps, 'variant' | 'disabled' | 'sx'> & {
  children: React.ReactNode
}
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
export const LeadingVisual: React.FC<VisualProps> = ({variant, disabled, sx = {}, ...props}) => {
  return (
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
  )
}

export type TrailingVisualProps = VisualProps
export const TrailingVisual: React.FC<VisualProps> = ({variant, disabled, ...props}) => {
  return (
    <Box
      as="span"
      sx={{
        height: '20px', // match height of text row
        flexShrink: 0,
        color: getVariantStyles(variant, disabled).annotationColor,
        marginLeft: 2
      }}
      {...props}
    >
      {props.children}
    </Box>
  )
}
