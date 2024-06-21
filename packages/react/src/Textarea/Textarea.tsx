import styled, {css} from 'styled-components'
import type {TextareaHTMLAttributes, ReactElement} from 'react'
import React from 'react'
import {TextInputBaseWrapper} from '../internal/components/TextInputWrapper'
import type {FormValidationStatus} from '../utils/types/FormValidationStatus'
import type {SxProp} from '../sx'
import sx from '../sx'

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
} & TextareaHTMLAttributes<HTMLTextAreaElement> &
  SxProp

const StyledTextarea = styled.textarea<TextareaProps>`
  border: 0;
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  -webkit-appearance: none;
  color: inherit;
  width: 100%;
  resize: both;

  &:focus {
    outline: 0;
  }

  ${props =>
    props.resize &&
    css`
      resize: ${props.resize};
    `}

  ${props =>
    props.disabled &&
    css`
      resize: none;
    `}
  ${sx};
`

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      value,
      disabled,
      sx: sxProp,
      required,
      validationStatus,
      rows = DEFAULT_TEXTAREA_ROWS,
      cols = DEFAULT_TEXTAREA_COLS,
      resize = DEFAULT_TEXTAREA_RESIZE,
      block,
      contrast,
      ...rest
    }: TextareaProps,
    ref,
  ): ReactElement => {
    return (
      <TextInputBaseWrapper
        sx={sxProp}
        validationStatus={validationStatus}
        disabled={disabled}
        block={block}
        contrast={contrast}
      >
        <StyledTextarea
          value={value}
          resize={resize}
          aria-required={required}
          aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
          ref={ref}
          disabled={disabled}
          rows={rows}
          cols={cols}
          {...rest}
        />
      </TextInputBaseWrapper>
    )
  },
)

Textarea.displayName = 'Textarea'

export default Textarea
