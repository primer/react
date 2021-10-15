import React from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import {ItemContext, ItemProps, getVariantStyles} from './Item'

type VisualProps = Pick<ItemProps, 'variant' | 'disabled' | 'sx'> & {
  children: React.ReactNode
}
export const LeadingVisualContainer: React.FC<SxProp> = ({sx = {}, ...props}) => {
  return (
    <Box
      as="span"
      sx={{
        height: '20px', // match height of text row
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        ...sx
      }}
      {...props}
    />
  )
}

export type LeadingVisualProps = VisualProps
export const LeadingVisual: React.FC<VisualProps> = ({variant, disabled, sx = {}, ...props}) => {
  const {registerSlot} = React.useContext(ItemContext)

  registerSlot(
    'LeadingVisual',
    <LeadingVisualContainer
      sx={{
        minWidth: 3,
        maxWidth: '20px', // square (same as width)
        marginRight: 2,
        color: getVariantStyles(variant, disabled).iconColor,
        svg: {fontSize: 0},
        ...sx
      }}
      {...props}
    >
      {props.children}
    </LeadingVisualContainer>
  )

  return null
}

export type TrailingVisualProps = VisualProps
export const TrailingVisual: React.FC<VisualProps> = ({variant, disabled, ...props}) => {
  const {registerSlot} = React.useContext(ItemContext)

  registerSlot(
    'TrailingVisual',
    <LeadingVisualContainer
      sx={{
        color: getVariantStyles(variant, disabled).annotationColor,
        marginLeft: 2
      }}
      {...props}
    >
      {props.children}
    </LeadingVisualContainer>
  )

  return null
}
