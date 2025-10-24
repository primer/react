import {clsx} from 'clsx'
import React, {useEffect, type ForwardedRef, type ElementRef} from 'react'
import {useRefObjectAsForwardedRef} from '../hooks'
import classes from './Link.module.css'
import type {ComponentProps} from '../utils/types'
import {type PolymorphicProps, fixedForwardRef} from '../utils/modern-polymorphic'

type StyledLinkProps<As extends React.ElementType = 'a'> = {
  as?: As
  /** @deprecated use CSS modules to style hover color */
  hoverColor?: string
  muted?: boolean
  // Link inside a text block
  inline?: boolean
}

export const UnwrappedLink = <As extends React.ElementType = 'a'>(
  props: PolymorphicProps<As, 'a', StyledLinkProps>,
  ref: ForwardedRef<unknown>,
) => {
  const {as: Component = 'a', className, inline, hoverColor, ...restProps} = props
  const innerRef = React.useRef<ElementRef<As>>(null)
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
      data-hover-color={hoverColor}
      {...restProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={innerRef as any}
    />
  )
}

const LinkComponent = fixedForwardRef(UnwrappedLink)

const Link = Object.assign(LinkComponent, {displayName: 'Link'})

export type LinkProps = ComponentProps<typeof Link>
export default Link
