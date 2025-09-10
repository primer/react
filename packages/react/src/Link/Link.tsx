import {clsx} from 'clsx'
import React, {useEffect} from 'react'
import type {ElementType, ForwardedRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Link.module.css'
import type {ComponentProps} from '../utils/types'
import {type PolymorphicProps, fixedForwardRef} from '../utils/modern-polymorphic'

type StyledLinkProps = {
  /** @deprecated use CSS modules to style hover color */
  hoverColor?: string
  muted?: boolean
  /** @deprecated use `inline` to specify the type of link instead */
  underline?: boolean
  // Link inside a text block
  inline?: boolean
}

export const UnwrappedLink = <As extends ElementType>(
  props: {
    as?: As
  } & StyledLinkProps &
    PolymorphicProps<As, 'a'>,
  ref: ForwardedRef<unknown>,
) => {
  const {as: Component = 'a', className, inline, underline, hoverColor, ...restProps} = props
  const innerRef = React.useRef<HTMLElement>(null)
  useRefObjectAsForwardedRef(ref, innerRef)

  if (__DEV__) {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (
        innerRef.current &&
        !(innerRef.current instanceof HTMLButtonElement) &&
        !(innerRef.current instanceof HTMLAnchorElement)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          'Error: Found `Link` component that renders an inaccessible element',
          innerRef.current,
          'Please ensure `Link` always renders as <a> or <button>',
        )
      }
    }, [innerRef])
  }

  return (
    <Component
      className={clsx(className, classes.Link)}
      data-muted={restProps.muted}
      data-inline={inline}
      data-underline={underline}
      data-hover-color={hoverColor}
      {...restProps}
      ref={innerRef}
    />
  )
}

const LinkComponent = fixedForwardRef(UnwrappedLink)

const Link = Object.assign(LinkComponent, {displayName: 'Link'})

export type LinkProps = ComponentProps<typeof Link>
export default Link
