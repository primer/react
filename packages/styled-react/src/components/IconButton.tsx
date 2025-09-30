import {
  IconButton as PrimerIconButton,
  type IconButtonProps as PrimerIconButtonProps,
  sx,
  type SxProp,
} from '@primer/react'
import {type ForwardRefComponent} from '../polymorphic'
import {Box} from './Box'
import {generateCustomSxProp} from './Button'
import {forwardRef} from 'react'

type IconButtonProps = PrimerIconButtonProps & SxProp

const StyledIconButton = forwardRef(({sx, ...rest}: PrimerIconButtonProps, ref) => {
  let sxStyles = sx
  // grap the button props that have associated data attributes in the styles
  const {size = 'medium'} = rest

  if (sx !== null && Object.keys(sx).length > 0) {
    sxStyles = generateCustomSxProp({size}, sx)
  }
  return <Box sx={sxStyles} as={PrimerIconButton} ref={ref} {...rest} />
})

const IconButton = (({as, ...props}: IconButtonProps) => (
  <StyledIconButton forwardedAs={as} {...props} />
)) as ForwardRefComponent<'a' | 'button', IconButtonProps>

export {IconButton}
export type {IconButtonProps}
