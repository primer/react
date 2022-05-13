import React, {forwardRef} from 'react'
import {IconProps} from '@primer/octicons-react'
import {Box, Button, IconButton, Tooltip} from '.'
import {ButtonProps} from './Button'
import {BetterSystemStyleObject, merge, SxProp} from './sx'

type TextInputActionProps = Omit<React.HTMLProps<HTMLButtonElement>, 'aria-label' | 'size'> & {
  /** @deprecated Text input action buttons should only use icon buttons */
  children?: React.ReactNode
  /** Text that appears in a tooltip. If an icon is passed, this is also used as the label used by assistive technologies. */
  ['aria-label']?: string
  /** The icon to render inside the button */
  icon?: React.FunctionComponent<IconProps>
  /**
   * @deprecated Text input action buttons should only use the 'invisible' button variant
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: ButtonProps['variant']
} & SxProp

const invisibleButtonStyleOverrides = {
  color: 'fg.default',
  paddingTop: '2px',
  paddingRight: '4px',
  paddingBottom: '2px',
  paddingLeft: '4px',
  position: 'relative',

  '@media (pointer: coarse)': {
    ':after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      top: '50%',
      minHeight: '44px'
    }
  }
}

const ConditionalTooltip: React.FC<{
  ['aria-label']?: string
  children: React.ReactElement
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
      variant === 'invisible'
        ? merge<BetterSystemStyleObject>(invisibleButtonStyleOverrides, sxProp || {})
        : sxProp || {}

    if ((icon && !ariaLabel) || (!children && !ariaLabel)) {
      // eslint-disable-next-line no-console
      console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology')
    }

    return (
      <Box as="span" className="TextInput-action" margin={1}>
        {icon && !children ? (
          <Tooltip aria-label={ariaLabel}>
            <IconButton
              variant={variant}
              type="button"
              icon={icon}
              aria-label={ariaLabel}
              size="small"
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
