import React from 'react'
import styled from 'styled-components'
import type {MaxWidthProps, MinWidthProps, WidthProps} from 'styled-system'
import {maxWidth, minWidth, width} from 'styled-system'
import {get} from '../../constants'
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
  width?: string
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler
} & /** @deprecated Update `width` using CSS modules or style. */ WidthProps &
  /** @deprecated Update `min-width` using CSS modules or style. */ MinWidthProps &
  /** @deprecated Update `max-width` using CSS modules or style. */ MaxWidthProps &
  SxProp

export type StyledWrapperProps = {
  hasLeadingVisual?: boolean
  hasTrailingVisual?: boolean
} & StyledBaseWrapperProps

export const StyledTextInputBaseWrapper = styled.span<StyledBaseWrapperProps>`
  font-size: ${get('fontSizes.1')};
  line-height: var(--base-size-20);
  color: ${get('colors.fg.default')};
  vertical-align: middle;
  background-color: ${get('colors.canvas.default')};
  border: 1px solid var(--control-borderColor-rest, ${get('colors.border.default')});
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.primer.shadow.inset')};
  display: inline-flex;
  align-items: stretch;
  min-height: var(--base-size-32);
  overflow: hidden;

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
      color: var(---control-fgColor-placeholder, ${get('colors.fg.muted')});
    }
  }

  &:where([data-trailing-action][data-focused]),
  &:where(:not([data-trailing-action]):focus-within) {
    border-color: ${get('colors.accent.fg')};
    outline: 2px solid ${get('colors.accent.fg')};
    outline-offset: -1px;
  }

  > textarea {
    padding: var(--base-size-12);
  }

  &:where([data-contrast]) {
    background-color: ${get('colors.canvas.inset')};
  }

  &:where([data-disabled]) {
    color: ${get('colors.primer.fg.disabled')};
    background-color: ${get('colors.input.disabledBg')};
    box-shadow: none;
    border-color: var(--control-borderColor-disabled, ${get('colors.border.default')});

    input,
    textarea,
    select {
      cursor: not-allowed;
    }
  }

  &:where([data-monospace]) {
    font-family: ${get('fonts.mono')};
  }

  &:where([data-validation='error']) {
    border-color: ${get('colors.success.emphasis')};

    &:where([data-trailing-action][data-focused]),
    &:where(:not([data-trailing-action])):focus-within {
      border-color: ${get('colors.accent.fg')};
      outline: 2px solid ${get('colors.accent.fg')};
      outline-offset: -1px;
    }
  }

  &:where([data-validation='success']) {
    border-color: ${get('colors.success.emphasis')};
  }

  &:where([data-block]) {
    display: flex;
    width: 100%;
    align-self: stretch;
  }

  /* Ensures inputs don' t zoom on mobile but are body-font size on desktop */
  @media (min-width: ${get('breakpoints.1')}) {
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
    width,
    style,
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
      style={width ? {width, ...style} : style}
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
