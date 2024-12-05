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
import {clsx} from 'clsx'
import {useFeatureFlag} from '../FeatureFlags'
import classes from './Heading.module.css'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingVariants = 'large' | 'medium' | 'small'
export type ActionListHeadingProps = {
  as: HeadingLevels
  size?: HeadingVariants
  visuallyHidden?: boolean
  className?: string
} & SxProp

export const Heading = forwardRef(
  ({as, size, children, sx = defaultSxProp, visuallyHidden = false, className, ...props}, forwardedRef) => {
    const innerRef = React.useRef<HTMLHeadingElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const enabled = useFeatureFlag('primer_react_css_modules_team')

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
        {enabled ? (
          sx !== defaultSxProp ? (
            <HeadingComponent
              as={as}
              variant={size}
              ref={innerRef}
              // use custom id if it is provided. Otherwise, use the id from the context
              id={props.id ?? headingId}
              className={clsx(className, classes.ActionListHeader)}
              data-list-variant={listVariant}
              sx={sx}
              {...props}
            >
              {children}
            </HeadingComponent>
          ) : (
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
          )
        ) : (
          <HeadingComponent
            as={as}
            variant={size}
            ref={innerRef}
            // use custom id if it is provided. Otherwise, use the id from the context
            id={props.id ?? headingId}
            sx={merge<BetterSystemStyleObject>(styles, sx)}
            className={className}
            {...props}
          >
            {children}
          </HeadingComponent>
        )}
      </VisuallyHidden>
    )
  },
) as PolymorphicForwardRefComponent<HeadingLevels, ActionListHeadingProps>

Heading.displayName = 'ActionList.Heading'
