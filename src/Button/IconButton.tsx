import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import Box from '../Box'
import {IconButtonProps, StyledButton} from './types'
import {getBaseStyles, getSizeStyles, getVariantStyles} from './styles'
import {Tooltip, TooltipContext} from '../Tooltip'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {
    variant = 'default',
    size = 'medium',
    sx: sxProp = {},
    icon: Icon,
    disableTooltip = false,
    'aria-label': ariaLabel,
    ...rest
  } = props
  const {theme} = useTheme()

  const sxStyles = merge.all([
    getBaseStyles(theme),
    getSizeStyles(size, variant, true),
    getVariantStyles(variant, theme),
    sxProp as SxProp
  ])

  // If button is already wrapped in a Tooltip,
  // do not add another.
  const {tooltipId} = React.useContext(TooltipContext)

  if (tooltipId || disableTooltip) {
    return (
      <StyledButton sx={sxStyles} aria-label={ariaLabel} {...rest} ref={forwardedRef}>
        <Box as="span" sx={{display: 'inline-block'}}>
          <Icon />
        </Box>
      </StyledButton>
    )
  }

  // use Tooltip with type=label and skip aria-label on button
  // because the aria-labelledby is provided by the tooltip
  return (
    <Tooltip text={ariaLabel} type="label">
      <StyledButton sx={sxStyles} {...rest} ref={forwardedRef}>
        <Box as="span" sx={{display: 'inline-block'}}>
          <Icon />
        </Box>
      </StyledButton>
    </Tooltip>
  )
})

export {IconButton}
