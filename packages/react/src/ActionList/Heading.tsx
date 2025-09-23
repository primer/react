import React, {forwardRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {default as HeadingComponent} from '../Heading'
import {ListContext} from './shared'
import VisuallyHidden from '../_VisuallyHidden'
import {ActionListContainerContext} from './ActionListContainerContext'
import {invariant} from '../utils/invariant'
import {clsx} from 'clsx'
import classes from './Heading.module.css'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingVariants = 'large' | 'medium' | 'small'
export type ActionListHeadingProps = {
  as: HeadingLevels
  size?: HeadingVariants
  visuallyHidden?: boolean
  className?: string
}

export const Heading = forwardRef(({as, size, children, visuallyHidden = false, className, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLHeadingElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  const {headingId: headingId, variant: listVariant} = React.useContext(ListContext)
  const {container} = React.useContext(ActionListContainerContext)

  // Semantic <menu>s don't have a place for headers within them, they should be aria-labelledby the menu button's name.
  invariant(
    container !== 'ActionMenu',
    `ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.`,
  )

  return (
    <VisuallyHidden isVisible={!visuallyHidden}>
      <HeadingComponent
        as={as}
        variant={size}
        ref={innerRef}
        // use custom id if it is provided. Otherwise, use the id from the context
        id={props.id ?? headingId}
        className={clsx(className, classes.ActionListHeader)}
        data-list-variant={listVariant}
        {...props}
      >
        {children}
      </HeadingComponent>
    </VisuallyHidden>
  )
}) as PolymorphicForwardRefComponent<HeadingLevels, ActionListHeadingProps>

Heading.displayName = 'ActionList.Heading'
