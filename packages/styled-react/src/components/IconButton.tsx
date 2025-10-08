import {IconButton as PrimerIconButton, type IconButtonProps as PrimerIconButtonProps, type SxProp} from '@primer/react'
import {type ForwardRefComponent} from '../polymorphic'
import {generateCustomSxProp} from './Button'
import {forwardRef} from 'react'
import styled from 'styled-components'
import {sx} from '../sx'

type IconButtonProps = PrimerIconButtonProps & SxProp & {as?: React.ElementType}

const StyledIconButton = styled(PrimerIconButton).withConfig({
  shouldForwardProp: prop => (prop as keyof IconButtonProps) !== 'sx',
})<IconButtonProps>`
  ${sx}
`

const IconButton = forwardRef(({as, sx, ...props}: IconButtonProps, ref) => {
  let sxStyles = sx
  // grap the button props that have associated data attributes in the styles
  const {size = 'medium'} = props

  if (sx !== null && sx !== undefined && Object.keys(sx).length > 0) {
    sxStyles = generateCustomSxProp({size}, sx)
  }

  return <StyledIconButton sx={sxStyles} {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
}) as ForwardRefComponent<'a' | 'button', IconButtonProps>

export {IconButton}
export type {IconButtonProps}
