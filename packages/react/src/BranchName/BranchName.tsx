import type React from 'react'
import {forwardRef, type ForwardedRef} from 'react'
import {clsx} from 'clsx'
import type {IconProps} from '@primer/octicons-react'
import classes from './BranchName.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import {useSlots} from '../hooks/useSlots'
import type {FCWithSlotMarker, WithSlotMarker} from '../utils/types'
import {IconButton} from '../Button'
import {Tooltip} from '../TooltipV2'

// ----------------------------------------------------------------------------
// BranchName.LeadingVisual

type LeadingVisualProps = {
  children?: React.ReactNode
}

const LeadingVisual: FCWithSlotMarker<LeadingVisualProps> = ({children}) => {
  return (
    <span className={classes.LeadingVisual} data-component="BranchName.LeadingVisual">
      {children}
    </span>
  )
}

LeadingVisual.displayName = 'BranchName.LeadingVisual'
LeadingVisual.__SLOT__ = Symbol('BranchName.LeadingVisual')

// ----------------------------------------------------------------------------
// BranchName.TrailingAction

type TrailingActionProps = {
  icon: React.ComponentType<React.PropsWithChildren<IconProps>>
  'aria-label': string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const TrailingAction = forwardRef<HTMLButtonElement, TrailingActionProps>(
  ({icon, 'aria-label': ariaLabel, onClick}, ref) => {
    return (
      <span className={classes.TrailingAction} data-component="BranchName.TrailingAction">
        <IconButton
          ref={ref}
          icon={icon}
          aria-label={ariaLabel}
          variant="invisible"
          size="small"
          onClick={onClick}
          className={classes.TrailingActionButton}
        />
      </span>
    )
  },
)

TrailingAction.displayName = 'BranchName.TrailingAction'
;(TrailingAction as WithSlotMarker<typeof TrailingAction>).__SLOT__ = Symbol('BranchName.TrailingAction')

// ----------------------------------------------------------------------------
// BranchName

export type BranchNameProps<As extends React.ElementType> = PolymorphicProps<
  As,
  'a',
  {
    className?: string
    /** Description tooltip text (renders as aria-describedby) */
    description?: string
  }
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BranchNameComponent<As extends React.ElementType>(props: BranchNameProps<As>, ref: ForwardedRef<any>) {
  const {as: Component = 'a', className, children, description, ...rest} = props

  const [slots, textChildren] = useSlots(children, {
    leadingVisual: LeadingVisual,
    trailingAction: TrailingAction,
  })

  // Simple case: no trailing action, render as before
  if (!slots.trailingAction) {
    const linkContent = (
      <Component {...rest} ref={ref} className={clsx(className, classes.BranchName)} data-component="BranchName">
        {slots.leadingVisual}
        {textChildren}
      </Component>
    )

    if (description) {
      return (
        <Tooltip text={description} type="description">
          {linkContent}
        </Tooltip>
      )
    }

    return linkContent
  }

  // Complex case: has a trailing action, wrap in container
  const linkContent = (
    <Component
      {...rest}
      ref={ref}
      className={clsx(className, classes.BranchName, classes.BranchNameTransparent)}
      data-component="BranchName"
    >
      {slots.leadingVisual}
      {textChildren}
    </Component>
  )

  return (
    <span className={classes.BranchNameWithTrailingAction} data-component="BranchName.Container">
      {description ? (
        <Tooltip text={description} type="description">
          {linkContent}
        </Tooltip>
      ) : (
        linkContent
      )}
      {slots.trailingAction}
    </span>
  )
}

BranchNameComponent.displayName = 'BranchName'

const BranchName = Object.assign(fixedForwardRef(BranchNameComponent), {
  LeadingVisual,
  TrailingAction,
})

export default BranchName
