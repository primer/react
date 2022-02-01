import styled, {css} from 'styled-components'
import React, {TextareaHTMLAttributes, ReactElement} from 'react'
import {TextInputBaseWrapper} from './_TextInputWrapper'
import {FormValidationStatus} from './utils/types/FormValidationStatus'
import sx, {SxProp} from './sx'

export type TextareaProps = {
  /**
   * Apply inactive visual appearance to the Textarea
   */
  disabled?: boolean
  /**
   * Indicates whether the Textarea is a required form field
   */
  required?: boolean
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
      rows = 7,
      cols = 30,
      resize = 'both',
      block,
      ...rest
    }: TextareaProps,
    ref
  ): ReactElement => {
    return (
      <TextInputBaseWrapper sx={sxProp} validationStatus={validationStatus} disabled={disabled} block={block}>
        <StyledTextarea
          value={value}
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

Textarea.displayName = 'Textarea'

export default Textarea
