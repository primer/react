import styled, {css} from 'styled-components'
import React, {TextareaHTMLAttributes, ReactElement} from 'react'
import {TextInputBaseWrapper} from './_TextInputWrapper'
import {FormValidationStatus} from './utils/types/FormValidationStatus'
import sx, {SxProp} from './sx'
import {get} from './constants'

export type TextAreaProps = {
  /**
   * Apply inactive visual appearance to the TextArea
   */
  disabled?: boolean
  /**
   * Indicates whether the TextArea is a required form field
   */
  required?: boolean
  /**
   * Indicates whether the TextArea validation state
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
} & TextareaHTMLAttributes<HTMLTextAreaElement> &
  SxProp

const StyledTextArea = styled.textarea<TextAreaProps>`
  border: 0;
  font-size: inherit;
  font-family: inherit;
  background-color: transparent;
  -webkit-appearance: none;
  color: inherit;
  width: 100%;

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
      cursor: not-allowed;
    `}

  ${sx};
`

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {disabled, sx: sxProp, required, validationStatus, rows = 7, cols = 30, resize = 'both', ...rest}: TextAreaProps,
    ref
  ): ReactElement => {
    return (
      <TextInputBaseWrapper sx={sxProp} validationStatus={validationStatus} disabled={disabled}>
        <StyledTextArea
          resize={resize}
          required={required}
          aria-required={required ? 'true' : 'false'}
          aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
          ref={ref}
          disabled={disabled}
          rows={rows}
          cols={cols}
          {...rest}
        />
      </TextInputBaseWrapper>
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
