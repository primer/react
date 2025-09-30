import type React from 'react'
import {forwardRef} from 'react'
import type {IconProps} from '@primer/octicons-react'
import {Button, IconButton} from '../../Button'
import {Tooltip} from '../../TooltipV2'
import type {ButtonProps} from '../../Button'
import type {SxProp} from '../../sx'
import {clsx} from 'clsx'

import styles from './TextInputInnerAction.module.css'

export type TextInputActionProps = Omit<
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

const ConditionalTooltip: React.FC<
  React.PropsWithChildren<{
    ['aria-label']?: string
    tooltipDirection?: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'
    children: React.ReactNode
  }>
> = ({'aria-label': ariaLabel, children, tooltipDirection}) => (
  <>
    {ariaLabel ? (
      <Tooltip text={ariaLabel} direction={tooltipDirection} className={styles.ConditionalTooltip}>
        {children}
      </Tooltip>
    ) : (
      children
    )}
  </>
)

const TextInputAction = forwardRef<HTMLButtonElement, TextInputActionProps>(
  (
    {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      tooltipDirection,
      children,
      icon,
      sx: sxProp,
      className,
      variant = 'invisible',
      ...rest
    },
    forwardedRef,
  ) => {
    const styleProps = {className: clsx(variant === 'invisible' && styles.Invisible, className), sx: sxProp || {}}

    if ((icon && !ariaLabel) || (!children && !ariaLabel)) {
      // eslint-disable-next-line no-console
      console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology')
    }

    const accessibleLabel = ariaLabel
      ? {'aria-label': ariaLabel}
      : ariaLabelledBy
        ? {'aria-labelledby': ariaLabelledBy}
        : {
            'aria-label': '',
          }

    return (
      <span className={clsx('TextInput-action', styles.TextInputAction)}>
        {icon && !children && ariaLabel ? (
          <IconButton
            {...accessibleLabel}
            tooltipDirection={tooltipDirection ?? 's'}
            variant={variant}
            type="button"
            icon={icon}
            size="small"
            {...styleProps}
            {...rest}
            ref={forwardedRef}
          />
        ) : (
          <ConditionalTooltip aria-label={ariaLabel}>
            <Button variant={variant} type="button" {...styleProps} {...rest} ref={forwardedRef}>
              {children}
            </Button>
          </ConditionalTooltip>
        )}
      </span>
    )
  },
)

export default TextInputAction
