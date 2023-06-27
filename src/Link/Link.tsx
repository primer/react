import React, {forwardRef} from 'react'
import styled from 'styled-components'
import {system} from 'styled-system'
import {get} from '../constants'
import {useRefObjectAsForwardedRef} from '../hooks'
import sx, {SxProp} from '../sx'
import {ComponentProps} from '../utils/types'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'

type StyledLinkProps = {
  hoverColor?: string
  muted?: boolean
  underline?: boolean
} & SxProp

const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors',
  },
})

const StyledLink = styled.a<StyledLinkProps>`
  color: ${props => (props.muted ? get('colors.fg.muted')(props) : get('colors.accent.fg')(props))};
  text-decoration: ${props => (props.underline ? 'underline' : 'none')};
  &:hover,
  &:focus {
    text-decoration: ${props => (props.muted ? 'none' : 'underline')};
    ${props => (props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.accent.fg')(props)}` : '')};
  }
  ${sx};
`

const Link = forwardRef(({as, ...props}, forwardedRef) => {
  const innerRef = React.useRef<HTMLAnchorElement>(null)
  useRefObjectAsForwardedRef(forwardedRef, innerRef)

  if (as !== undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'Links no longer accept an as prop. If you need to style another tag as a link, you should use a different component and apply appropriate styling.',
    )
  }

  return (
    <StyledLink
      {...props}
      // @ts-ignore shh
      ref={innerRef}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledLinkProps>

Link.displayName = 'Link'

export type LinkProps = ComponentProps<typeof Link>
export default Link
