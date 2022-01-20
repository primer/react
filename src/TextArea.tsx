import styled, {css} from 'styled-components'
import React, {TextareaHTMLAttributes, ReactElement} from 'react'
import {FormValidationStatus} from './utils/types/FormValidationStatus'
import sx, {SxProp} from './sx'
import {get} from './constants'

export type TextAreaProps = {
  /**
   * Apply inactive visual appearance to the TextArea
   */
  disabled?: boolean
  /**
   * Indicates whether the TextArea must be checked
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
  /**
   * Applies a custom width to the textarea
   */
  width?: number
  /**
   * Applies a custom height to the textarea
   */
  height?: number
} & TextareaHTMLAttributes<HTMLTextAreaElement> &
  SxProp

const StyledTextArea = styled.textarea<TextAreaProps>`
  min-height: 124px;
  font-family: inherit;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  vertical-align: middle;
  background-color: ${get('colors.canvas.default')};
  border: 1px solid ${get('colors.border.default')};
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.primer.shadow.inset')};
  cursor: text;
  display: inline-flex;
  align-items: stretch;
  padding: ${get('space.2')};

  &:focus-within {
    border-color: ${get('colors.accent.emphasis')};
    box-shadow: ${get('shadows.primer.shadow.focus')};
  }

  &::placeholder {
    color: ${get('colors.fg.subtle')};
  }

  ${props =>
    props.validationStatus === 'error' &&
    css`
      border-color: ${get('colors.danger.emphasis')};
      &:focus-within {
        border-color: ${get('colors.danger.emphasis')};
        box-shadow: ${get('shadows.btn.danger.focusShadow')};
      }
    `}

  ${props =>
    props.validationStatus === 'success' &&
    css`
      border-color: ${get('colors.success.emphasis')};
      &:focus-within {
        border-color: ${get('colors.success.emphasis')};
        box-shadow: 0 0 0 3px ${get('colors.success.muted')};
      }
    `}
  
    ${props =>
    props.block &&
    css`
      width: 100%;
      display: flex;
    `}

  

  ${props =>
    props.resize &&
    css`
      resize: ${props.resize};
    `}

    ${props =>
    props.width &&
    css`
      resize: ${props.resize === 'vertical' && !props.height ? 'vertical' : 'none'};
      width: ${props.width}px;
    `} 

    ${props =>
    props.height &&
    css`
      resize: ${props.resize === 'horizontal' && !props.width ? 'horizontal' : 'none'};
      height: ${props.height}px;
    `} 

    ${props =>
    props.disabled &&
    css`
      resize: none;
      color: ${get('colors.primer.fg.disabled')};
      background-color: ${get('colors.input.disabledBg')};
      border-color: ${get('colors.border.default')};
      cursor: not-allowed;
    `}

  @media (min-width: 360px) {
    min-width: 300px;
  }

  // Ensures inputs don't zoom on mobile but are body-font size on desktop
  @media (min-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')};
  }

  ${sx}
`

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {disabled, sx: sxProp, required, validationStatus, width, height, resize = 'both', ...rest}: TextAreaProps,
    ref
  ): ReactElement => {
    return (
      <StyledTextArea
        ref={ref}
        disabled={disabled}
        sx={sxProp}
        validationStatus={validationStatus}
        resize={resize}
        width={width}
        height={height}
        aria-required={required ? 'true' : 'false'}
        aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
        {...rest}
      />
    )
  }
)

TextArea.displayName = 'TextArea'

export default TextArea
