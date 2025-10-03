import {IconButton as PrimerIconButton, type IconButtonProps as PrimerIconButtonProps, type SxProp} from '@primer/react'
import {type ForwardRefComponent} from '../polymorphic'
import {Box} from './Box'
import {generateCustomSxProp} from './Button'
import {forwardRef} from 'react'

type IconButtonProps = PrimerIconButtonProps & SxProp & {as?: React.ElementType}

const StyledIconButton = forwardRef(({sx, ...rest}: IconButtonProps, ref) => {
  let sxStyles = sx
  // grap the button props that have associated data attributes in the styles
  const {size = 'medium'} = rest

  if (sx !== null && sx !== undefined && Object.keys(sx).length > 0) {
    sxStyles = generateCustomSxProp({size}, sx)
  }
  return <Box sx={sxStyles} as={PrimerIconButton} ref={ref} {...rest} />
})

const IconButton = forwardRef(({as, ...props}: IconButtonProps, ref) => (
  <StyledIconButton {...props} {...(as ? {forwardedAs: as} : {})} ref={ref} />
)) as ForwardRefComponent<'a' | 'button', IconButtonProps>

export {IconButton}
export type {IconButtonProps}
