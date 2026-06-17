import type React from 'react'
import {forwardRef, type ForwardedRef} from 'react'
import {clsx} from 'clsx'
import type {IconProps} from '@primer/octicons-react'
import classes from './BranchName.module.css'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import {useSlots} from '../hooks/useSlots'
import {IconButton} from '../Button'
import {Tooltip} from '../TooltipV2'
import Octicon from '../Octicon'

// ----------------------------------------------------------------------------
// BranchName.LeadingVisual

type LeadingVisualProps = {
  children?: React.ReactNode
  icon?: React.ComponentType<React.PropsWithChildren<IconProps>>
}

const LeadingVisual: React.FC<LeadingVisualProps> = ({children, icon}) => {
  if (icon) {
    return (
      <span className={classes.LeadingVisual} data-component="BranchName.LeadingVisual">
        <Octicon icon={icon} />
      </span>
    )
  }
  return (
    <span className={classes.LeadingVisual} data-component="BranchName.LeadingVisual">
      {children}
    </span>
  )
}

LeadingVisual.displayName = 'BranchName.LeadingVisual'

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

  // Only use slots for LeadingVisual (single instance)
  // TrailingActions can have multiple, so we manually filter
  const [slots, restChildren] = useSlots(children, {
    leadingVisual: LeadingVisual,
  })

  // Collect all trailing actions (there may be multiple)
  const trailingActions: React.ReactNode[] = []
  const textChildren: React.ReactNode[] = []

  // Separate trailing actions from other children
  const childArray = Array.isArray(restChildren) ? restChildren : [restChildren]
  for (const child of childArray) {
    if (
      child &&
      typeof child === 'object' &&
      'type' in child &&
      (child.type === TrailingAction ||
        (child.type as {displayName?: string}).displayName === 'BranchName.TrailingAction')
    ) {
      trailingActions.push(child)
    } else {
      textChildren.push(child)
    }
  }

  const hasTrailingActions = trailingActions.length > 0
  const hasLeadingVisual = !!slots.leadingVisual

  // Simple case: no trailing actions, render as before
  if (!hasTrailingActions) {
    const linkContent = (
      <Component {...rest} ref={ref} className={clsx(className, classes.BranchName)} data-component="BranchName">
        {hasLeadingVisual && slots.leadingVisual}
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

  // Complex case: has trailing actions, wrap in container
  const linkContent = (
    <Component
      {...rest}
      ref={ref}
      className={clsx(className, classes.BranchName, classes.BranchNameTransparent)}
      data-component="BranchName"
    >
      {hasLeadingVisual && slots.leadingVisual}
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
      {trailingActions}
    </span>
  )
}

BranchNameComponent.displayName = 'BranchName'

const BranchName = Object.assign(fixedForwardRef(BranchNameComponent), {
  LeadingVisual,
  TrailingAction,
})

export default BranchName
