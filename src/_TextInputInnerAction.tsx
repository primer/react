import React, {forwardRef} from 'react'
import {IconProps} from '@primer/octicons-react'
import {Box, Button, IconButton, Tooltip} from '.'
import {ButtonProps} from './Button'
import {BetterSystemStyleObject, merge, SxProp} from './sx'

type TextInputActionProps = Omit<React.HTMLProps<HTMLButtonElement>, 'aria-label' | 'size'> & {
  /** Text that appears in a tooltip. If an icon is passed, this is also used as the label used by assistive technologies. */
  ['aria-label']?: string
  /** The icon to render inside the button */
  icon?: React.FunctionComponent<IconProps>
  /**
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: ButtonProps['variant']
} & SxProp

const invisibleButtonStyleOverrides = {
  color: 'fg.default'
}

const ConditionalTooltip: React.FC<{
  ['aria-label']?: string
  children: React.ReactNode
}> = ({'aria-label': ariaLabel, children}) => (
  <>
    {ariaLabel ? (
      <Tooltip
        aria-label={ariaLabel}
        sx={{
          /* inline-block is used to ensure the tooltip dimensions don't
             collapse when being used with `grid` or `inline` children */
          display: 'inline-block'
        }}
      >
        {children}
      </Tooltip>
    ) : (
      children
    )}
  </>
)

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>(
  ({'aria-label': ariaLabel, children, icon, sx: sxProp, variant, ...rest}, forwardedRef) => {
    const sx =
      variant === 'invisible' ? merge<BetterSystemStyleObject>(invisibleButtonStyleOverrides, sxProp || {}) : sxProp

    if ((icon && !ariaLabel) || (!children && !ariaLabel)) {
      // eslint-disable-next-line no-console
      console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology')
    }

    return (
      <Box as="span" className="TextInput-action">
        {icon && !children ? (
          <Tooltip aria-label={ariaLabel}>
            <IconButton
              variant={variant}
              type="button"
              icon={icon}
              aria-label={ariaLabel}
              sx={sx}
              {...rest}
              ref={forwardedRef}
            />
          </Tooltip>
        ) : (
          <ConditionalTooltip aria-label={ariaLabel}>
            <Button variant={variant} size="small" type="button" sx={sx} {...rest} ref={forwardedRef}>
              {children}
            </Button>
          </ConditionalTooltip>
        )}
      </Box>
    )
  }
)

TextInputAction.defaultProps = {
  variant: 'invisible'
}

export default TextInputAction
