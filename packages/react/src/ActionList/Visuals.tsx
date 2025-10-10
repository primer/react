import React from 'react'
import {AlertIcon} from '@primer/octicons-react'
import Spinner from '../Spinner'
import {ItemContext} from './shared'
import {Tooltip, type TooltipProps} from '../TooltipV2'
import {clsx} from 'clsx'
import classes from './ActionList.module.css'

export type VisualProps = React.HTMLAttributes<HTMLSpanElement>

export const VisualContainer: React.FC<React.PropsWithChildren<VisualProps>> = ({className, ...props}) => {
  return <span className={clsx(className, classes.VisualWrap)} {...props} />
}

export type ActionListLeadingVisualProps = VisualProps
export const LeadingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({className, ...props}) => {
  return (
    <VisualContainer className={clsx(className, classes.LeadingVisual)} {...props}>
      {props.children}
    </VisualContainer>
  )
}

export type ActionListTrailingVisualProps = VisualProps
export const TrailingVisual: React.FC<React.PropsWithChildren<VisualProps>> = ({className, ...props}) => {
  const {trailingVisualId} = React.useContext(ItemContext)
  return (
    <VisualContainer className={clsx(className, classes.TrailingVisual)} id={trailingVisualId} {...props}>
      {props.children}
    </VisualContainer>
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
      <Tooltip text={inactiveText} type="description">
        <button type="button" className={classes.InactiveButtonReset} aria-labelledby={labelId}>
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

LeadingVisual.displayName = 'ActionList.LeadingVisual'
TrailingVisual.displayName = 'ActionList.TrailingVisual'

// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
LeadingVisual.__SLOT__ = Symbol('ActionList.LeadingVisual')
// @ts-ignore - TypeScript doesn't know about the __SLOT__ property
TrailingVisual.__SLOT__ = Symbol('ActionList.TrailingVisual')
