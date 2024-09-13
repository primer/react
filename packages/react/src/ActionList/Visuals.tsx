import React from 'react'
import {AlertIcon} from '@primer/octicons-react'
import Box from '../Box'
import Spinner from '../Spinner'
import {get} from '../constants'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {ItemContext, TEXT_ROW_HEIGHT, getVariantStyles} from './shared'
import {Tooltip, type TooltipProps} from '../TooltipV2'

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
  const {variant, disabled, inactive, trailingVisualId} = React.useContext(ItemContext)
  return (
    <Box
      id={trailingVisualId}
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

// VisualOrIndicator handles the positioning of indicators and determines whether to show a visual or an indicator.
//
// If we're showing an *inactive* or *loading* indicator and a leading visual has NOT been passed,
// replace the trailing visual with the inactive indicator.
//
// This preserves the left alignment of item text.
export const VisualOrIndicator: React.FC<
  React.PropsWithChildren<{
    inactiveText?: TooltipProps['text']
    itemHasLeadingVisual: boolean
    labelId?: string
    loading?: boolean
    position: 'leading' | 'trailing'
  }>
> = ({children, labelId, loading, inactiveText, itemHasLeadingVisual, position}) => {
  const VisualComponent = position === 'leading' ? LeadingVisual : TrailingVisual

  if (!loading && !inactiveText) return children

  if (
    (itemHasLeadingVisual && position === 'trailing') || // has a leading visual, and it's in the trailing position, or
    (!itemHasLeadingVisual && position === 'leading') // it doesn't have a leading visual, and it's in the leading position
  ) {
    // => so we don't render the indicator here
    return children
  }

  return inactiveText ? (
    <Tooltip text={inactiveText} type="label">
      <Box
        as="button"
        sx={{
          background: 'none',
          color: 'inherit',
          border: 'none',
          padding: 0,
          font: 'inherit',
          cursor: 'pointer',
        }}
        aria-describedby={labelId}
      >
        <VisualComponent>
          <AlertIcon />
        </VisualComponent>
      </Box>
    </Tooltip>
  ) : (
    <VisualComponent>
      <Spinner size="small" />
    </VisualComponent>
  )
}
