import styled, {css} from 'styled-components'
import {maxWidth, MaxWidthProps, minWidth, MinWidthProps, variant, width, WidthProps} from 'styled-system'
import {get} from '../../constants'
import sx, {SxProp} from '../../sx'
import {FormValidationStatus} from '../../utils/types/FormValidationStatus'

export type TextInputSizes = 'small' | 'medium' | 'large'

const sizeDeprecatedVariants = variant({
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px',
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3,
    },
  },
})

const sizeVariants = variant({
  prop: 'size',
  variants: {
    small: {
      '--inner-action-size': '20px',
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px',
    },
    medium: {
      '--inner-action-size': '24px',
    },
    large: {
      '--inner-action-size': '28px',
      px: 2,
      py: '10px',
      height: '40px',
    },
  },
})

export type StyledBaseWrapperProps = {
  block?: boolean
  contrast?: boolean
  disabled?: boolean
  hasTrailingAction?: boolean
  isInputFocused?: boolean
  monospace?: boolean
  validationStatus?: FormValidationStatus
} & WidthProps &
  MinWidthProps &
  MaxWidthProps &
  SxProp

export type StyledWrapperProps = {
  hasLeadingVisual?: boolean
  hasTrailingVisual?: boolean
  /** @deprecated Use `size` prop instead */
  variant?: TextInputSizes
  size?: TextInputSizes
} & StyledBaseWrapperProps

const textInputBasePadding = '12px'
export const textInputHorizPadding = textInputBasePadding

const renderFocusStyles = (hasTrailingAction: boolean, isInputFocused: boolean) => {
  if (hasTrailingAction) {
    return (
      isInputFocused &&
      css`
        border-color: ${get('colors.accent.fg')};
        outline: none;
        box-shadow: inset 0 0 0 1px ${get('colors.accent.fg')};
      `
    )
  }
  return css`
    &:focus-within {
      border-color: ${get('colors.accent.fg')};
      outline: none;
      box-shadow: inset 0 0 0 1px ${get('colors.accent.fg')};
    }
  `
}

export const TextInputBaseWrapper = styled.span<StyledBaseWrapperProps>`
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  vertical-align: middle;
  background-color: ${get('colors.canvas.default')};
  border: 1px solid ${get('colors.border.default')};
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.primer.shadow.inset')};
  display: inline-flex;
  align-items: stretch;
  min-height: 32px;

  input,
  textarea {
    cursor: text;
  }

  select {
    cursor: pointer;
  }

  &::placeholder {
    color: ${get('colors.fg.subtle')};
  }

  ${props => renderFocusStyles(Boolean(props.hasTrailingAction), Boolean(props.isInputFocused))}

  > textarea {
    padding: ${textInputBasePadding};
  }

  ${props =>
    props.contrast &&
    css`
      background-color: ${get('colors.canvas.inset')};
    `}

  ${props =>
    props.disabled &&
    css`
      color: ${get('colors.primer.fg.disabled')};
      background-color: ${get('colors.input.disabledBg')};
      border-color: ${get('colors.border.default')};

      input,
      textarea,
      select {
        cursor: not-allowed;
      }
    `}

    ${props =>
    props.monospace &&
    css`
      font-family: ${get('fonts.mono')};
    `}

  ${props =>
    props.validationStatus === 'error' &&
    css`
      border-color: ${get('colors.danger.emphasis')};
      ${renderFocusStyles(Boolean(props.hasTrailingAction), Boolean(props.isInputFocused))}
    `}


  ${props =>
    props.validationStatus === 'success' &&
    css`
      border-color: ${get('colors.success.emphasis')};
    `}

  ${props =>
    props.block &&
    css`
      width: 100%;
      display: flex;
      align-self: stretch;
    `}

  // Ensures inputs don' t zoom on mobile but are body-font size on desktop
  @media (min-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')};
  }

  ${width}
  ${minWidth}
  ${maxWidth}
  ${sizeDeprecatedVariants}
  ${sizeVariants}
  ${sx};
`

const TextInputWrapper = styled(TextInputBaseWrapper)<StyledWrapperProps>`
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.

  & > :not(:last-child) {
    margin-right: ${get('space.2')};
  }

  .TextInput-icon,
  .TextInput-action {
    align-self: center;
    color: ${get('colors.fg.muted')};
    flex-shrink: 0;
  }

  ${props =>
    css`
      padding-left: ${props.hasLeadingVisual ? textInputHorizPadding : 0};
      padding-right: ${props.hasTrailingVisual && !props.hasTrailingAction ? textInputHorizPadding : 0};

      > input,
      > select {
        padding-left: ${!props.hasLeadingVisual ? textInputHorizPadding : 0};
        padding-right: ${!props.hasTrailingVisual && !props.hasTrailingAction ? textInputHorizPadding : 0};
      }
    `}

  ${props =>
    props.validationStatus === 'warning' &&
    css`
      border-color: ${get('colors.attention.emphasis')};
      ${renderFocusStyles(Boolean(props.hasTrailingAction), Boolean(props.isInputFocused))}
    `}

  ${sx};
`

export default TextInputWrapper
