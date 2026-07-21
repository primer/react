import {clsx} from 'clsx'
import React, {type ForwardedRef, type ElementRef} from 'react'
import {useDevOnlyEffect} from '../internal/hooks/useDevOnlyEffect'
import {useMergedRefs} from '../hooks'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {as: Component = 'a', className, inline, muted, hoverColor: _hoverColor, ...restProps} = props
  const innerRef = React.useRef<ElementRef<As>>(null)
  const mergedRef = useMergedRefs(ref, innerRef)

  useDevOnlyEffect(() => {
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

  return (
    <Component
      className={clsx(className, classes.Link)}
      data-component="Link"
      data-muted={muted}
      data-inline={inline}
      {...restProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={mergedRef as any}
    />
  )
}

const LinkComponent = fixedForwardRef(UnwrappedLink)

const Link = Object.assign(LinkComponent, {displayName: 'Link'})

export type LinkProps = ComponentProps<typeof Link>
export default Link
