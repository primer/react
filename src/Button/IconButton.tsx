import React, {forwardRef} from 'react'
import {merge, BetterSystemStyleObject} from '../sx'
import {useTheme} from '../ThemeProvider'
import {IconButtonProps, StyledButton} from './types'
import {getBaseStyles, getVariantStyles} from './styles'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {defaultSxProp} from '../utils/defaultSxProp'

const IconButton = forwardRef((props, forwardedRef): JSX.Element => {
  const {variant = 'default', size = 'medium', sx: sxProp = defaultSxProp, icon: Icon, ...rest} = props
  const {theme} = useTheme()
  const sxStyles = merge.all<BetterSystemStyleObject>([getBaseStyles(theme), getVariantStyles(variant, theme), sxProp])
  return (
    <StyledButton
      data-component="IconButton"
      data-size={size}
      sx={sxStyles}
      {...rest}
      // @ts-expect-error StyledButton wants both Anchor and Button refs
      ref={forwardedRef}
    >
      <Icon />
    </StyledButton>
  )
}) as PolymorphicForwardRefComponent<'button' | 'a', IconButtonProps>

export {IconButton}
