import cx from 'clsx'
import React, {forwardRef, useEffect} from 'react'
import styled from 'styled-components'
import {system} from 'styled-system'
import {get} from '../constants'
import {useRefObjectAsForwardedRef} from '../hooks'
import type {SxProp} from '../sx'
import sx from '../sx'
import classes from './Link.module.css'
import {useFeatureFlag} from '../FeatureFlags'
import Box from '../Box'
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

  /* By default, Link does not have underline */
  text-decoration: none;

  /* You can add one by setting underline={true} */
  text-decoration: ${props => (props.underline ? 'underline' : undefined)};

  /* Inline links (inside a text block), however, should have underline based on accessibility setting set in data-attribute */
  /* Note: setting underline={false} does not override this */
  [data-a11y-link-underlines='true'] &[data-inline='true'] {
    text-decoration: underline;
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

const Link = forwardRef(({as: Component = 'a', className, ...props}, forwardedRef) => {
  const enabled = useFeatureFlag('primer_react_css_modules')

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

  if (enabled) {
    if (props.sx) {
      return (
        <Box
          as={Component}
          className={cx(className, classes.Link)}
          data-muted={props.muted}
          data-inline={props.inline}
          data-underline={props.underline}
          {...props}
          // @ts-ignore shh
          ref={innerRef}
        />
      )
    }

    return (
      <Component
        className={cx(className, classes.Link)}
        data-muted={props.muted}
        data-inline={props.inline}
        data-underline={props.underline}
        {...props}
        // @ts-ignore shh
        ref={innerRef}
      />
    )
  }

  return (
    <StyledLink
      as={Component}
      className={className}
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
