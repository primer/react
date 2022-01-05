import styled, {css} from 'styled-components'
import {maxWidth, MaxWidthProps, minWidth, MinWidthProps, variant, width, WidthProps} from 'styled-system'
import {get} from './constants'
import sx, {SxProp} from './sx'

const sizeDeprecatedVariants = variant({
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px'
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3
    }
  }
})

const sizeVariants = variant({
  prop: 'size',
  variants: {
    small: {
      minHeight: '28px',
      px: 2,
      py: '3px',
      fontSize: 0,
      lineHeight: '20px'
    },
    large: {
      px: 2,
      py: '10px',
      fontSize: 3
    }
  }
})

type StyledWrapperProps = {
  disabled?: boolean
  hasLeadingVisual?: boolean
  hasTrailingVisual?: boolean
  block?: boolean
  contrast?: boolean
  validationStatus?: 'error' | 'warning'
  /** @deprecated Use `size` prop instead */
  variant?: 'small' | 'large'
  size?: 'small' | 'large'
} & WidthProps &
  MinWidthProps &
  MaxWidthProps &
  SxProp

export const textInputHorizPadding = '12px'

const TextInputWrapper = styled.span<StyledWrapperProps>`
  min-height: 32px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  vertical-align: middle;
  background-color: ${get('colors.canvas.default')};
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.border.default')};
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.primer.shadow.inset')};
  cursor: text;
  display: inline-flex;
  align-items: stretch;
  & > :not(:last-child) {
    margin-right: ${get('space.2')};
  }

  ${props =>
    css`
      padding-left: ${props.hasLeadingVisual ? textInputHorizPadding : 0};
      padding-right: ${props.hasTrailingVisual ? textInputHorizPadding : 0};

      > input {
        padding-left: ${!props.hasLeadingVisual ? textInputHorizPadding : 0};
        padding-right: ${!props.hasTrailingVisual ? textInputHorizPadding : 0};
      }
    `}

  .TextInput-icon {
    align-self: center;
    color: ${get('colors.fg.muted')};
    flex-shrink: 0;
  }

  &:focus-within {
    border-color: ${get('colors.accent.emphasis')};
    box-shadow: ${get('shadows.primer.shadow.focus')};
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
    `}

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
    props.validationStatus === 'warning' &&
    css`
      border-color: ${get('colors.attention.emphasis')};
      &:focus-within {
        border-color: ${get('colors.attention.emphasis')};
        box-shadow: 0 0 0 3px ${get('colors.attention.muted')};
      }
    `}
  
    ${props =>
    props.block &&
    css`
      width: 100%;
      display: flex;
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

export default TextInputWrapper
