import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import systemPropTypes from '@styled-system/prop-types'
import {omit, pick} from '@styled-system/props'
import styled, {css} from 'styled-components'
import {variant, width, minWidth, maxWidth} from 'styled-system'
import {COMMON, get} from './constants'
import theme from './theme'
import sx from './sx'

const sizeVariants = variant({
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

// using forwardRef is important so that other components (ex. SelectMenu) can autofocus the input
const TextInput = React.forwardRef(({icon: IconComponent, className, block, disabled, sx, ...rest}, ref) => {
  // this class is necessary to style FilterSearch, plz no touchy!
  const wrapperClasses = classnames(className, 'TextInput-wrapper')
  const wrapperProps = pick(rest)
  const inputProps = omit(rest)
  return (
    <Wrapper
      className={wrapperClasses}
      hasIcon={!!IconComponent}
      block={block}
      theme={theme}
      disabled={disabled}
      sx={sx}
      {...wrapperProps}
    >
      {IconComponent && <IconComponent className="TextInput-icon" />}
      <Input ref={ref} disabled={disabled} {...inputProps} />
    </Wrapper>
  )
})

const Input = styled.input`
  border: 0;
  font-size: inherit;
  background-color: transparent;
  -webkit-appearance: none;
  color: inherit;
  width: 100%;
  &:focus {
    outline: 0;
  }
`

const Wrapper = styled.span`
  display: inline-flex;
  align-items: stretch;
  min-height: 34px;
  font-size: ${get('fontSizes.1')};
  line-height: 20px;
  color: ${get('colors.gray.9')};
  vertical-align: middle;
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.border.gray')};
  border-radius: ${get('radii.2')};
  outline: none;
  box-shadow: ${get('shadows.formControl')};

  ${(props) => {
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
    color: ${get('colors.gray.4')};
    margin: 0 ${get('space.2')};
    flex-shrink: 0;
  }

  &:focus-within {
    border-color: ${get('colors.blue.4')};
    box-shadow: ${get('shadows.formControl')}, ${get('shadows.formControlFocus')};
  }

  ${(props) =>
    props.disabled &&
    css`
     background-color: ${get('colors.bg.disabled')};
     box-shadow: ${get('shadows.formControlDisabled')}
    }
  `}

  ${(props) =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}

  // Ensures inputs don't zoom on mobile but are body-font size on desktop
  @media (min-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')};
  }
  ${COMMON}
  ${width}
  ${minWidth}
  ${maxWidth}
  ${sizeVariants}
  ${sx};
`

TextInput.defaultProps = {
  theme,
  type: 'text',
}

TextInput.propTypes = {
  block: PropTypes.bool,
  icon: PropTypes.elementType,
  maxWidth: systemPropTypes.layout.maxWidth,
  minWidth: systemPropTypes.layout.minWidth,
  variant: PropTypes.oneOf(['small', 'large']),
  ...COMMON.propTypes,
  ...sx.propTypes,
  width: systemPropTypes.layout.width,
}

TextInput.displayName = 'TextInput'

export default TextInput
