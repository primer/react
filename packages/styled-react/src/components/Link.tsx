import {Link as PrimerLink, type LinkProps as PrimerLinkProps} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import type {ForwardRefComponent} from '../polymorphic'
import {forwardRef} from 'react'

type LinkProps = PrimerLinkProps & SxProp

const StyledLink = styled(PrimerLink).withConfig<LinkProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
` as ForwardRefComponent<'a', LinkProps>

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({as, ...props}, ref) => {
  return <StyledLink {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'a', LinkProps>

// @ts-ignore -- TS doesn't know about the __SLOT__ property
Link.__SLOT__ = PrimerLink.__SLOT__

export {Link, type LinkProps}
