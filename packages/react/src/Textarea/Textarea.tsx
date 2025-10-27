import type {TextareaHTMLAttributes, ReactElement} from 'react'
import React from 'react'
import {TextInputBaseWrapper} from '../internal/components/TextInputWrapper'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import classes from './TextArea.module.css'
import type {WithSlotMarker} from '../utils/types'

export const DEFAULT_TEXTAREA_ROWS = 7
export const DEFAULT_TEXTAREA_COLS = 30
export const DEFAULT_TEXTAREA_RESIZE = 'both'

export type TextareaProps = {
  /**
   * Apply inactive visual appearance to the Textarea
   */
  disabled?: boolean
  /**
   * Indicates whether the Textarea validation state
   */
  validationStatus?: FormValidationStatus
  /**
   * Block
   */
  block?: boolean
  /**
   * Allows resizing of the textarea
   */
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  /**
   * apply a high contrast color to background
   */
  contrast?: boolean
  /**
   * The className to apply to the wrapper element
   */
  className?: string
  /**
   * The minimum height of the Textarea
   */
  minHeight?: number
  /**
   * The maximum height of the Textarea
   */
  maxHeight?: number
  /**
   * CSS styles to apply to the Textarea
   */
  style?: React.CSSProperties
} & TextareaHTMLAttributes<HTMLTextAreaElement>

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      disabled,
      required,
      validationStatus,
      rows = DEFAULT_TEXTAREA_ROWS,
      cols = DEFAULT_TEXTAREA_COLS,
      resize = DEFAULT_TEXTAREA_RESIZE,
      block,
      contrast,
      className,
      minHeight,
      maxHeight,
      style,
      ...rest
    }: TextareaProps,
    ref,
  ): ReactElement => {
    return (
      <TextInputBaseWrapper
        validationStatus={validationStatus}
        disabled={disabled}
        block={block}
        contrast={contrast}
        className={className}
      >
        <textarea
          value={value}
          data-resize={resize}
          aria-required={required}
          aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
          ref={ref}
          disabled={disabled}
          rows={rows}
          cols={cols}
          className={classes.TextArea}
          style={{
            minHeight,
            maxHeight,
            ...style,
          }}
          {...rest}
        />
      </TextInputBaseWrapper>
    )
  },
)

Textarea.displayName = 'Textarea'
;(Textarea as WithSlotMarker<typeof Textarea>).__SLOT__ = Symbol('Textarea')

export default Textarea as WithSlotMarker<typeof Textarea>
