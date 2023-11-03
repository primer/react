import React, {forwardRef} from 'react'
import {BetterSystemStyleObject, SxProp, merge} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useRefObjectAsForwardedRef} from '../hooks'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {default as HeadingComponent} from '../Heading'
import {ListContext} from './List'
import VisuallyHidden from '../_VisuallyHidden'
import {ActionListContainerContext} from './ActionListContainerContext'
import {invariant} from '../utils/invariant'
import {GroupContext} from './Group'
import Box from '../Box'

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

export type ActionListGroupHeadingProps = {
  as: HeadingLevels
  /**
   * Style variations. Usage is discretionary.
   *
   * - `"filled"` - Superimposed on a background, offset from nearby content
   * - `"subtle"` - Relatively less offset from nearby content
   */
  variant?: 'subtle' | 'filled'
  auxiliaryText?: string
} & SxProp

export const GroupHeading = forwardRef(
  ({as, variant, auxiliaryText, children, sx = defaultSxProp, ...props}, forwardedRef) => {
    const innerRef = React.useRef<HTMLHeadingElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {groupHeadingId: headingId} = React.useContext(GroupContext)
    const {variant: listVariant, role: listRole} = React.useContext(ListContext)

    const styles = {
      paddingY: '6px',
      paddingX: listVariant === 'full' ? 2 : 3,
      fontSize: 0,
      fontWeight: 'bold',
      color: 'fg.muted',
      ...(variant === 'filled' && {
        backgroundColor: 'canvas.subtle',
        marginX: 0,
        marginBottom: 2,
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'neutral.muted',
      }),
    }

    return (
      <>
        {listRole ? (
          <Box data-component="ActionList.GroupHeading" sx={styles} role="presentation" {...props}>
            <span id={props.id ?? headingId}>{children}</span>
            {auxiliaryText && <span>{auxiliaryText}</span>}
          </Box>
        ) : (
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
        )}
      </>
    )
  },
) as PolymorphicForwardRefComponent<HeadingLevels, ActionListGroupHeadingProps>
GroupHeading.displayName = 'ActionList.GroupHeading'
