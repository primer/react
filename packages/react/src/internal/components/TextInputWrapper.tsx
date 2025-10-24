import React, {type ComponentProps} from 'react'
import type {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import {clsx} from 'clsx'

import styles from './TextInputWrapper.module.css'

export type TextInputSizes = 'small' | 'medium' | 'large'

type StyledTextInputBaseWrapperProps = {
  block?: boolean
  contrast?: boolean
  disabled?: boolean
  hasTrailingAction?: boolean
  isInputFocused?: boolean
  monospace?: boolean
  validationStatus?: FormValidationStatus
  /** @deprecated Use `size` prop instead */
  variant?: TextInputSizes
  size?: TextInputSizes
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler
  children?: React.ReactNode
  /** @deprecated Update `width` using CSS modules or style. */
  width?: string | number
  /** @deprecated Update `min-width` using CSS modules or style. */
  minWidth?: string | number
  /** @deprecated Update `max-width` using CSS modules or style. */
  maxWidth?: string | number
}

type StyledTextInputWrapperProps = {
  hasLeadingVisual?: boolean
  hasTrailingVisual?: boolean
} & StyledTextInputBaseWrapperProps

export const TextInputBaseWrapper = React.forwardRef<HTMLElement, StyledTextInputWrapperProps>(
  function TextInputBaseWrapper(
    {
      className,
      style,
      variant,
      size,
      isInputFocused,
      hasTrailingAction,
      validationStatus,
      disabled,
      contrast,
      monospace,
      block,
      width,
      minWidth,
      maxWidth,
      ...restProps
    },
    forwardRef,
  ) {
    const memoizedStyle = React.useMemo(() => {
      return {
        ...(width ? {width} : {}),
        ...(minWidth ? {minWidth} : {}),
        ...(maxWidth ? {maxWidth} : {}),
        ...style,
      }
    }, [width, minWidth, maxWidth, style])

    return (
      <span
        {...restProps}
        ref={forwardRef}
        className={clsx(className, styles.TextInputBaseWrapper)}
        data-block={block || undefined}
        data-contrast={contrast || undefined}
        data-disabled={disabled || undefined}
        data-focused={isInputFocused || undefined}
        data-monospace={monospace || undefined}
        data-size={size || undefined}
        data-trailing-action={hasTrailingAction || undefined}
        data-validation={validationStatus || undefined}
        data-variant={variant || undefined}
        style={memoizedStyle}
      />
    )
  },
)
TextInputBaseWrapper.displayName = 'TextInputBaseWrapper'

export const TextInputWrapper = React.forwardRef<HTMLElement, StyledBaseWrapperProps>(function TextInputWrapper(
  {className, hasLeadingVisual, hasTrailingVisual, ...restProps},
  forwardRef,
) {
  return (
    <TextInputBaseWrapper
      {...restProps}
      ref={forwardRef}
      className={clsx(className, styles.TextInputWrapper)}
      data-leading-visual={hasLeadingVisual || undefined}
      data-trailing-visual={hasTrailingVisual || undefined}
    />
  )
})

export type StyledBaseWrapperProps = ComponentProps<typeof TextInputBaseWrapper>
export type StyledWrapperProps = ComponentProps<typeof TextInputWrapper>
export default TextInputWrapper
