import React, {forwardRef} from 'react'
import type {BetterSystemStyleObject, SxProp} from '../sx'
import {merge} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {default as HeadingComponent} from '../Heading'
import {ListContext} from './shared'
import VisuallyHidden from '../_VisuallyHidden'
import {ActionListContainerContext} from './ActionListContainerContext'
import {invariant} from '../utils/invariant'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type ActionListHeadingProps = {
  as: HeadingLevels
  visuallyHidden?: boolean
} & SxProp

export const Heading = forwardRef(
  ({as, children, sx = defaultSxProp, visuallyHidden = false, ...props}, forwardedRef) => {
    const innerRef = React.useRef<HTMLHeadingElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {headingId: headingId, variant: listVariant} = React.useContext(ListContext)
    const {container} = React.useContext(ActionListContainerContext)

    // Semantic <menu>s don't have a place for headers within them, they should be aria-labelledby the menu button's name.
    invariant(
      container !== 'ActionMenu',
      `ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.`,
    )

    const styles = {
      marginBottom: 2,
      marginX: listVariant === 'full' ? 2 : 3,
    }

    return (
      <VisuallyHidden isVisible={!visuallyHidden}>
        <HeadingComponent
          as={as}
          ref={innerRef}
          // use custom id if it is provided. Otherwise, use the id from the context
          id={props.id ?? headingId}
          sx={merge<BetterSystemStyleObject>(styles, sx)}
          {...props}
        >
          {children}
        </HeadingComponent>
      </VisuallyHidden>
    )
  },
) as PolymorphicForwardRefComponent<HeadingLevels, ActionListHeadingProps>

Heading.displayName = 'ActionList.Heading'
