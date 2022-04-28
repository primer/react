import React, {forwardRef} from 'react'
import {merge, SxProp} from '../sx'
import {useTheme} from '../ThemeProvider'
import Box from '../Box'
import {IconButtonProps, StyledButton} from './types'
import {getBaseStyles, getSizeStyles, getVariantStyles} from './styles'
import {Tooltip, TooltipContext, TooltipProps} from '../Tooltip'

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, forwardedRef): JSX.Element => {
  const {variant = 'default', size = 'medium', sx: sxProp = {}, icon: Icon, disableTooltip = false, ...rest} = props
  const {theme} = useTheme()

  const sxStyles = merge.all([
    getBaseStyles(theme),
    getSizeStyles(size, variant, true),
    getVariantStyles(variant, theme),
    sxProp as SxProp
  ])

  return (
    <ConditionalTooltip text={props['aria-label']} disableTooltip={disableTooltip}>
      <StyledButton sx={sxStyles} {...rest} ref={forwardedRef}>
        <Box as="span" sx={{display: 'inline-block'}}>
          <Icon />
        </Box>
      </StyledButton>
    </ConditionalTooltip>
  )
})

export {IconButton}

const ConditionalTooltip: React.FC<TooltipProps & Pick<IconButtonProps, 'disableTooltip'>> = ({
  text,
  disableTooltip,
  children
}) => {
  // If button is already wrapped in a Tooltip,
  // do not add another.
  const {tooltipId} = React.useContext(TooltipContext)

  if (tooltipId || disableTooltip) return children

  return (
    <Tooltip text={text} type="label">
      {children}
    </Tooltip>
  )
}
