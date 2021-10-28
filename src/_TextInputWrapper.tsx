import styled, {css} from 'styled-components'
import {maxWidth, MaxWidthProps, minWidth, MinWidthProps, variant, width, WidthProps} from 'styled-system'
import {get} from './constants'
import sx, {SxProp} from './sx'

const sizeVariants = variant({
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
  hasIcon?: boolean
  block?: boolean
  contrast?: boolean
  variant?: 'small' | 'large'
} & WidthProps &
  MinWidthProps &
  MaxWidthProps &
  SxProp

const TextInputWrapper = styled.span<StyledWrapperProps>`
  display: inline-flex;
  align-items: stretch;
  min-height: 34px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.fg.default')};
  vertical-align: middle;
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.border.default')};
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.primer.shadow.inset')};
  cursor: text;

  ${props => {
    if (props.hasIcon) {
      return css`
        padding: 0;
      `
    } else {
      return css`
        padding: 6px 12px;
      `
    }
  }}

  .TextInput-icon {
    align-self: center;
    color: ${get('colors.fg.muted')};
    margin: 0 ${get('space.2')};
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
    props.block &&
    css`
      display: block;
      width: 100%;
    `}
  
    // Ensures inputs don't zoom on mobile but are body-font size on desktop
    @media (min-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')};
  }
  ${width}
  ${minWidth}
    ${maxWidth}
    ${sizeVariants}
    ${sx};
`

export default TextInputWrapper
