import React, {forwardRef} from 'react'
import {BetterSystemStyleObject, SxProp, merge} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useRefObjectAsForwardedRef} from '../hooks'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {default as HeadingComponent} from '../Heading'
import {ListContext} from './List'

export type ActionListHeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /**
   * Style variations. Usage is discretionary.
   *
   * - `"filled"` - Superimposed on a background, offset from nearby content
   * - `"subtle"` - Relatively less offset from nearby content
   */
  variant?: 'subtle' | 'filled'
} & SxProp

export const Heading = forwardRef(
  ({as: Component = 'h3', children, sx = defaultSxProp, variant = 'subtle', ...props}, forwardedRef) => {
    const innerRef = React.useRef<HTMLHeadingElement>(null)
    useRefObjectAsForwardedRef(forwardedRef, innerRef)

    const {headingId: headingId, variant: listVariant} = React.useContext(ListContext)

    const styles = {
      paddingY: 2,
      paddingX: listVariant === 'full' ? 2 : 3,
      fontSize: 0,
      fontWeight: 'bold',
      color: 'fg.muted',
      listStyle: 'none',
      lineHeight: 'calc(20 / 12)',
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
    )
  },
) as PolymorphicForwardRefComponent<'h3', ActionListHeadingProps>

Heading.displayName = 'ActionList.Heading'
