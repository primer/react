import {Link as PrimerLink, type LinkProps as PrimerLinkProps} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'

type LinkProps = PrimerLinkProps & SxProp

const StyledLink = styled(PrimerLink).withConfig<LinkProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`
const Link = ({as, ...props}: LinkProps) => <Link {...props} {...(as ? {forwardedAs: as} : {})} />

export {Link, type LinkProps}
