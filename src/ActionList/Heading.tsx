import React, {forwardRef} from 'react'
import {BetterSystemStyleObject, SxProp, merge} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useRefObjectAsForwardedRef} from '../hooks'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {default as HeadingComponent} from '../Heading'
import {ListContext} from './List'
import VisuallyHidden from '../_VisuallyHidden'

export type ActionListHeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  visuallyHidden?: boolean
} & SxProp

export const Heading = forwardRef(
  ({as: Component = 'h3', children, sx = defaultSxProp, visuallyHidden = false, ...props}, forwardedRef) => {
    const innerRef = React.useRef<HTMLHeadingElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {headingId: headingId, variant: listVariant} = React.useContext(ListContext)

    const styles = {
      marginBottom: 2,
      marginX: listVariant === 'full' ? 2 : 3,
    }

    return (
      <VisuallyHidden isVisible={!visuallyHidden}>
        <HeadingComponent
          as={Component}
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
) as PolymorphicForwardRefComponent<'h3', ActionListHeadingProps>

Heading.displayName = 'ActionList.Heading'
