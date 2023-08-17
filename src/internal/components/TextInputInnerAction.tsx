import React, {forwardRef} from 'react'
import {IconProps} from '@primer/octicons-react'
import Box from '../../Box'
import {Button, IconButton, ButtonProps} from '../../Button'
import Tooltip from '../../Tooltip'
import {BetterSystemStyleObject, merge, SxProp} from '../../sx'

type TextInputActionProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-label' | 'size' | 'tooltipDirection'
> & {
  /** @deprecated Text input action buttons should only use icon buttons */
  children?: React.ReactNode
  /** Text that appears in a tooltip. If an icon is passed, this is also used as the label used by assistive technologies. */
  ['aria-label']?: string
  /** Position of tooltip. If no position is passed or defaults to "n" */
  tooltipDirection?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
  /** The icon to render inside the button */
  icon?: React.FunctionComponent<React.PropsWithChildren<IconProps>>
  /**
   * @deprecated Text input action buttons should only use the 'invisible' button variant
   * Determine's the styles on a button one of 'default' | 'primary' | 'invisible' | 'danger'
   */
  variant?: ButtonProps['variant']
} & SxProp

const invisibleButtonStyleOverrides = {
  paddingTop: '2px',
  paddingRight: '4px',
  paddingBottom: '2px',
  paddingLeft: '4px',
  position: 'relative',

  '&[data-component="IconButton"]': {
    width: 'var(--inner-action-size)',
    height: 'var(--inner-action-size)',
  },

  '@media (pointer: coarse)': {
    ':after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      top: '50%',
      minHeight: '44px',
    },
  },
}

const ConditionalTooltip: React.FC<
  React.PropsWithChildren<{
    ['aria-label']?: string
    tooltipDirection?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
    children: React.ReactNode
  }>
> = ({'aria-label': ariaLabel, children, tooltipDirection}) => (
  <>
    {ariaLabel ? (
      <Tooltip
        aria-label={ariaLabel}
        direction={tooltipDirection}
        sx={{
          /* inline-block is used to ensure the tooltip dimensions don't
             collapse when being used with `grid` or `inline` children */
          display: 'inline-block',
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
  (
    {'aria-label': ariaLabel, tooltipDirection, children, icon, sx: sxProp, variant = 'invisible', ...rest},
    forwardedRef,
  ) => {
    const sx =
      variant === 'invisible'
        ? merge<BetterSystemStyleObject>(invisibleButtonStyleOverrides, sxProp || {})
        : sxProp || {}

    if ((icon && !ariaLabel) || (!children && !ariaLabel)) {
      // eslint-disable-next-line no-console
      console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology')
    }

    return (
      <Box as="span" className="TextInput-action" marginLeft={1} marginRight={1} lineHeight="0">
        {icon && !children ? (
          <Tooltip direction={tooltipDirection} aria-label={ariaLabel}>
            <IconButton
              variant={variant}
              type="button"
              icon={icon}
              size="small"
              sx={sx}
              {...rest}
              aria-label={ariaLabel as unknown as string}
              aria-labelledby={undefined}
              ref={forwardedRef}
            />
          </Tooltip>
        ) : (
          <ConditionalTooltip aria-label={ariaLabel}>
            <Button variant={variant} type="button" sx={sx} {...rest} ref={forwardedRef}>
              {children}
            </Button>
          </ConditionalTooltip>
        )}
      </Box>
    )
  },
)

export default TextInputAction
