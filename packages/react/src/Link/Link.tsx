import React, {forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import {system} from 'styled-system'
import {get} from '../constants'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {SxProp} from '../sx'
import sx from '../sx'
import type {ComponentProps} from '../utils/types'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledLinkProps = {
  hoverColor?: string
  muted?: boolean
  /** @deprecated use `inline` to specify the type of link instead */
  underline?: boolean
  // Link inside a text block
  inline?: boolean
} & SxProp

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors',
  },
})

const StyledLink = styled.a<StyledLinkProps>`
  color: ${props => (props.muted ? get('colors.fg.muted')(props) : get('colors.accent.fg')(props))};

  /* By default, Link is not underlined. */
  text-decoration: none;

  /* If inline or underline are set to true Link is underlined. */
  text-decoration: ${props => (props.underline ? 'underline' : undefined)};
  text-decoration: ${props => (props.inline ? 'underline' : undefined)};

  /* Inline links, adjacent to text, can be controlled using a data-attribute. */
  /* This way the inline property can be overwritten based on the attribute.
  /* On github.com this is used for a user preference in the accessibility settings. */
  [data-a11y-link-underlines='true'] &[data-inline='true'] {
    text-decoration: underline;
  }
  [data-a11y-link-underlines='false'] &[data-inline='true'] {
    text-decoration: none;
  }

  &:hover {
    text-decoration: ${props => (props.muted ? 'none' : 'underline')};
    ${props => (props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.accent.fg')(props)}` : '')};
  }
  &:is(button) {
    display: inline-block;
    padding: 0;
    font-size: inherit;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    background-color: transparent;
    border: 0;
    appearance: none;
  }
  ${sx};
`

const Link = forwardRef(({as: Component = 'a', ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLAnchorElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  if (__DEV__) {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
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
    <StyledLink
      as={Component}
      data-inline={props.inline}
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledLinkProps>

Link.displayName = 'Link'

export type LinkProps = ComponentProps<typeof Link>
export default Link
