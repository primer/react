import React from 'react'
import {AlertIcon} from '@primer/octicons-react'
import Box from '../Box'
import Spinner from '../Spinner'
import type {SxProp} from '../sx'
import {merge} from '../sx'
import {ItemContext, getVariantStyles} from './shared'
import {Tooltip, type TooltipProps} from '../TooltipV2'
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './ActionList.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import {actionListCssModulesFlag} from './featureflag'

export type VisualProps = SxProp & React.HTMLAttributes<HTMLSpanElement>

export const VisualContainer: React.FC<React.PropsWithChildren<VisualProps>> = ({
  sx = defaultSxProp,
  className,
  ...props
}) => {
  if (sx !== defaultSxProp) {
    return <Box as="span" className={clsx(className, classes.VisualWrap)} sx={sx} {...props} />
  }
  return <span className={clsx(className, classes.VisualWrap)} {...props} />
}

// remove when primer_react_css_modules_X is shipped
export const LeadingVisualContainer: React.FC<React.PropsWithChildren<VisualProps>> = ({
  sx = defaultSxProp,
  ...props
}) => {
  return (
    <Box
      as="span"
      sx={merge(
        {
          height: '20px', // match height of text row
          maxWidth: '20px', // square (same as height)
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
          marginRight: 2,
          color: 'fg.muted',
        },
        sx as SxProp,
      )}
      {...props}
    />
  )
}

export type ActionListLeadingVisualProps = VisualProps
export const LeadingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({
  sx = defaultSxProp,
  className,
  ...props
}) => {
  const {variant, disabled, inactive} = React.useContext(ItemContext)

  const enabled = useFeatureFlag(actionListCssModulesFlag)

  if (enabled) {
    return (
      <VisualContainer className={clsx(className, classes.LeadingVisual)} sx={sx} {...props}>
        {props.children}
      </VisualContainer>
    )
  }
  return (
    <LeadingVisualContainer
      className={className}
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
export const TrailingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({
  sx = defaultSxProp,
  className,
  ...props
}) => {
  const {variant, disabled, inactive, trailingVisualId} = React.useContext(ItemContext)
  const enabled = useFeatureFlag(actionListCssModulesFlag)
  if (enabled) {
    if (sx !== defaultSxProp) {
      return (
        <VisualContainer className={clsx(className, classes.TrailingVisual)} sx={sx} id={trailingVisualId} {...props}>
          {props.children}
        </VisualContainer>
      )
    }
    return (
      <VisualContainer className={clsx(className, classes.TrailingVisual)} id={trailingVisualId} {...props}>
        {props.children}
      </VisualContainer>
    )
  }
  return (
    <Box
      id={trailingVisualId}
      as="span"
      className={className}
      sx={merge(
        {
          height: '20px', // match height of text row
          flexShrink: 0,
          color: getVariantStyles(variant, disabled, inactive).annotationColor,
          marginLeft: 2,
          fontWeight: 'initial',
          display: 'grid',
          alignContent: 'center',
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
    className?: string
  }>
> = ({children, labelId, loading, inactiveText, itemHasLeadingVisual, position, className}) => {
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
    <span className={classes.InactiveButtonWrap}>
      <Tooltip text={inactiveText} type="label">
        <button type="button" className={classes.InactiveButtonReset} aria-describedby={labelId}>
          <VisualComponent>
            <AlertIcon />
          </VisualComponent>
        </button>
      </Tooltip>
    </span>
  ) : (
    <VisualComponent className={className}>
      <Spinner size="small" />
    </VisualComponent>
  )
}
