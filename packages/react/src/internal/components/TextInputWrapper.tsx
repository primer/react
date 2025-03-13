import React, {type ComponentProps} from 'react'
import styled from 'styled-components'
import {maxWidth as maxWidthFn, minWidth as minWidthFn, width as widthFn, type ResponsiveValue} from 'styled-system'
import {get} from '../../constants'
import type {SxProp} from '../../sx'
import sx from '../../sx'
import type {FormValidationStatus} from '../../utils/types/FormValidationStatus'
import {TEXT_INPUT_CSS_MODULES_FEATURE_FLAG} from './UnstyledTextInput'
import {toggleStyledComponent} from '../utils/toggleStyledComponent'
import {useFeatureFlag} from '../../FeatureFlags'
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
  width?: string | number | ResponsiveValue<string | number>
  /** @deprecated Update `min-width` using CSS modules or style. */
  minWidth?: string | number | ResponsiveValue<string | number>
  /** @deprecated Update `max-width` using CSS modules or style. */
  maxWidth?: string | number | ResponsiveValue<string | number>
} & SxProp

type StyledTextInputWrapperProps = {
  hasLeadingVisual?: boolean
  hasTrailingVisual?: boolean
} & StyledTextInputBaseWrapperProps

const StyledTextInputBaseWrapper = toggleStyledComponent(
  TEXT_INPUT_CSS_MODULES_FEATURE_FLAG,
  'span',
  styled.span<StyledTextInputBaseWrapperProps>`
    font-size: ${get('fontSizes.1')};
    line-height: var(--base-size-20);
    color: ${get('colors.fg.default')};
    vertical-align: middle;
    cursor: text;
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
      border-color: ${get('colors.danger.emphasis')};

      &:where([data-trailing-action][data-focused]),
      &:where(:not([data-trailing-action])):focus-within {
        border-color: ${get('colors.danger.emphasis')};
        outline: 2px solid ${get('colors.danger.emphasis')};
        outline-offset: -1px;
      }
    }

    &:where([data-validation='success']) {
      border-color: ${get('colors.success.emphasis')};
    }

    &:where([data-block]) {
      width: 100%;
      display: flex;
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
      ${widthFn}
      ${minWidthFn}
      ${maxWidthFn}
      ${sx}
    }
  `,
)

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
    const enabled = useFeatureFlag(TEXT_INPUT_CSS_MODULES_FEATURE_FLAG)
    const widthProps = enabled ? {} : {width, minWidth, maxWidth}

    return (
      <StyledTextInputBaseWrapper
        ref={forwardRef}
        className={clsx(className, enabled && styles.TextInputBaseWrapper)}
        data-block={block || undefined}
        data-contrast={contrast || undefined}
        data-disabled={disabled || undefined}
        data-focused={isInputFocused || undefined}
        data-monospace={monospace || undefined}
        data-size={size || undefined}
        data-trailing-action={hasTrailingAction || undefined}
        data-validation={validationStatus || undefined}
        data-variant={variant || undefined}
        style={enabled && typeof width === 'string' ? {width, ...style} : style}
        {...widthProps}
        {...restProps}
      />
    )
  },
)
TextInputBaseWrapper.displayName = 'TextInputBaseWrapper'

const StyledTextInputWrapper = toggleStyledComponent(
  TEXT_INPUT_CSS_MODULES_FEATURE_FLAG,
  TextInputBaseWrapper,
  styled(TextInputBaseWrapper)<StyledTextInputWrapperProps>`
    /* Repeat and position set for form states (success, error, etc) */
    background-repeat: no-repeat;

    /* For form validation. This keeps images 8px from right and centered vertically. */
    background-position: right 8px center;

    & > :not(:last-child) {
      margin-right: ${get('space.2')};
    }

    .TextInput-icon,
    .TextInput-action {
      align-self: center;
      color: ${get('colors.fg.muted')};
      flex-shrink: 0;
    }

    padding-right: 0;
    padding-left: 0;

    > input,
    > select {
      padding-right: 0;
      padding-left: 0;
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
  `,
)

export const TextInputWrapper = React.forwardRef<HTMLElement, StyledBaseWrapperProps>(function TextInputWrapper(
  {className, hasLeadingVisual, hasTrailingVisual, ...restProps},
  forwardRef,
) {
  const enabled = useFeatureFlag(TEXT_INPUT_CSS_MODULES_FEATURE_FLAG)

  if (enabled) {
    return (
      <TextInputBaseWrapper
        ref={forwardRef}
        className={clsx(className, styles.TextInputWrapper)}
        data-leading-visual={hasLeadingVisual || undefined}
        data-trailing-visual={hasTrailingVisual || undefined}
        {...restProps}
      />
    )
  } else {
    return (
      <StyledTextInputWrapper
        ref={forwardRef}
        className={className}
        data-leading-visual={hasLeadingVisual || undefined}
        data-trailing-visual={hasTrailingVisual || undefined}
        {...restProps}
      />
    )
  }
})

export type StyledBaseWrapperProps = ComponentProps<typeof TextInputBaseWrapper>
export type StyledWrapperProps = ComponentProps<typeof TextInputWrapper>
export default TextInputWrapper
