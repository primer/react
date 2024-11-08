import React from 'react'
import styled from 'styled-components'
import type {MaxWidthProps, MinWidthProps, WidthProps} from 'styled-system'
import {maxWidth, minWidth, width} from 'styled-system'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {FormValidationStatus} from '../../utils/types/FormValidationStatus'

export type TextInputSizes = 'small' | 'medium' | 'large'

export type StyledBaseWrapperProps = {
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
} & WidthProps &
  MinWidthProps &
  MaxWidthProps &
  SxProp &
  React.ComponentPropsWithoutRef<'span'>

export type StyledWrapperProps = {
  hasLeadingVisual?: boolean
  hasTrailingVisual?: boolean
} & StyledBaseWrapperProps

export const StyledTextInputBaseWrapper = styled.span<StyledBaseWrapperProps>`
  display: inline-flex;
  min-height: var(--base-size-32);
  overflow: hidden;
  font-size: var(--text-body-size-medium);
  line-height: var(--base-size-20);
  color: var(--fgColor-default);
  vertical-align: middle;
  background-color: var(--bgColor-default);
  border: var(--borderWidth-thin) solid var(--control-borderColor-rest);
  border-radius: var(--borderRadius-medium);
  outline: none;
  box-shadow: var(--shadow-inset);
  align-items: stretch;

  input,
  textarea {
    cursor: text;
  }

  select {
    cursor: pointer;
  }

  input,
  textarea,
  select {
    &::placeholder {
      color: var(---control-fgColor-placeholder, var(--fgColor-muted));
    }
  }

  &:where([data-trailing-action][data-focused]),
  &:where(:not([data-trailing-action]):focus-within) {
    border-color: var(--borderColor-accent-emphasis);
    outline: var(--borderWidth-thick) solid var(--borderColor-accent-emphasis);
    outline-offset: -1px;
  }

  > textarea {
    padding: var(--base-size-12);
  }

  &:where([data-contrast]) {
    background-color: var(--bgColor-inset);
  }

  &:where([data-disabled]) {
    color: var(--fgColor-disabled);
    background-color: var(--control-bgColor-disabled);
    border-color: var(--control-borderColor-disabled);
    box-shadow: none;

    input,
    textarea,
    select {
      cursor: not-allowed;
    }
  }

  &:where([data-monospace]) {
    font-family: var(--fontStack-monospace);
  }

  &:where([data-validation='error']) {
    border-color: var(--borderColor-danger-emphasis);

    &:where([data-trailing-action][data-focused]),
    &:where(:not([data-trailing-action])):focus-within {
      border-color: var(--fgColor-accent);
      outline: 2px solid var(--fgColor-accent);
      outline-offset: -1px;
    }
  }

  &:where([data-validation='success']) {
    border-color: var(--bgColor-success-emphasis);
  }

  &:where([data-block]) {
    display: flex;
    width: 100%;
    align-self: stretch;
  }

  /* Ensures inputs don' t zoom on mobile but are body-font size on desktop */
  @media (min-width: var(--breakpoint-medium)) {
    font-size: var(--text-body-size-medium);
  }

  --inner-action-size: var(--base-size-24); /* Default size */

  &:where([data-size='small']) {
    --inner-action-size: var(--base-size-20);

    min-height: var(--base-size-28);
    padding-top: 3px;
    padding-right: var(--base-size-8);
    padding-bottom: 3px;
    padding-left: var(--base-size-8);
    font-size: var(--text-body-size-small);
    line-height: var(--base-size-20);
  }

  &:where([data-size='large']) {
    --inner-action-size: var(--base-size-28);

    height: var(--base-size-40);
    padding-top: 10px;
    padding-right: var(--base-size-8);
    padding-bottom: 10px;
    padding-left: var(--base-size-8);
  }

  /* Deprecated */
  &:where([data-variant='small']) {
    min-height: 28px;
    padding-top: 3px;
    padding-right: var(--base-size-8);
    padding-bottom: 3px;
    padding-left: var(--base-size-8);
    font-size: (--text-body-size-small);
    line-height: var(--base-size-20);
  }

  /* Deprecated */
  &:where([data-variant='large']) {
    padding-top: 10px;
    padding-right: var(--base-size-8);
    padding-bottom: 10px;
    padding-left: var(--base-size-8);
    font-size: var(--text-title-size-medium);
  }

  & {
    ${width}
    ${minWidth}
    ${maxWidth}
    ${sx}
  }
`

export function TextInputBaseWrapper(props: React.PropsWithChildren<StyledBaseWrapperProps>) {
  const {
    variant,
    size,
    isInputFocused,
    hasTrailingAction,
    validationStatus,
    disabled,
    contrast,
    monospace,
    block,
    ...restProps
  } = props
  return (
    <StyledTextInputBaseWrapper
      data-variant={variant}
      data-size={size}
      data-focused={isInputFocused || undefined}
      data-trailing-action={hasTrailingAction || undefined}
      data-validation={validationStatus}
      data-disabled={disabled || undefined}
      data-contrast={contrast || undefined}
      data-monospace={monospace || undefined}
      data-block={block || undefined}
      {...restProps}
    />
  )
}

const StyledTextInputWrapper = styled(TextInputBaseWrapper)<StyledWrapperProps>`
  padding-right: 0;
  padding-left: 0;

  > input,
  > select {
    padding-right: 0;
    padding-left: 0;
  }

  /* Repeat and position set for form states (success, error, etc) */
  background-repeat: no-repeat;

  /* For form validation. This keeps images 8px from right and centered vertically. */
  background-position: right 8px center;

  & > :not(:last-child) {
    margin-right: var(--base-size-8);
  }

  .TextInput-icon,
  .TextInput-action {
    align-self: center;
    color: var(--fgColor-muted);
    flex-shrink: 0;
  }

  &:where([data-leading-visual]) {
    padding-left: var(--base-size-12);
  }

  &:where([data-trailing-visual]:not([data-trailing-action])) {
    padding-right: var(--base-size-12);
  }

  &:where(:not([data-leading-visual])) > input,
  &:where(:not([data-leading-visual])) > select {
    padding-left: var(--base-size-12);
  }

  &:where(:not([data-trailing-visual]):not([data-trailing-action])) > input,
  &:where(:not([data-trailing-visual]):not([data-trailing-action])) > select {
    padding-right: var(--base-size-12);
  }

  & {
    ${sx}
  }
`

export function TextInputWrapper(props: React.PropsWithChildren<StyledWrapperProps>) {
  const {hasLeadingVisual, hasTrailingVisual, ...restProps} = props
  return (
    <StyledTextInputWrapper
      data-leading-visual={hasLeadingVisual || undefined}
      data-trailing-visual={hasTrailingVisual || undefined}
      {...restProps}
    />
  )
}

export default TextInputWrapper
