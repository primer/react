import {Link as PrimerLink, type LinkProps as PrimerLinkProps} from '@primer/react'
import styled from 'styled-components'
import {sx, type SxProp} from '../sx'
import {forwardRef} from 'react'

type LinkProps = PrimerLinkProps & SxProp

const StyledLink = styled(PrimerLink).withConfig<LinkProps>({
  shouldForwardProp: prop => prop !== 'sx',
})`
  ${sx}
`

const Link = forwardRef<Element, LinkProps & {as?: React.ElementType}>(({as, ...props}, ref) => {
  return <StyledLink ref={ref} {...props} {...(as ? {forwardedAs: as} : {})} />
})

export {Link, type LinkProps}
