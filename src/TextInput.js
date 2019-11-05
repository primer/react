import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import systemPropTypes from '@styled-system/prop-types'
import styled, {css} from 'styled-components'
import Octicon from './StyledOcticon'
import {variant, width} from 'styled-system'
import {COMMON, get} from './constants'
import theme from './theme'

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

const TextInput = ({icon, type, className, width, theme, ...rest}) => {
  const wrapperClasses = classnames(className, 'TextInput-wrapper')
  const inputClasses = classnames(icon ? 'input-icon' : 'input-no-icon')
  const hasIcon = !!icon
  return (
    <Wrapper width={width} className={wrapperClasses} theme={theme}>
      {icon && <Octicon className="TextInput-icon" icon={icon} />}
      <Input className={inputClasses} hasIcon={hasIcon} {...rest} />
    </Wrapper>
  )
}

const Input = styled.input.attrs(props => ({
  type: props.type || 'text'
}))`
  border: 0;
  margin-right: ${get('space.1')};
  font-size: ${get('fontSizes.2')};
  background-color: transparent;
  color: inherit;
  ${props =>
    props.width &&
    css`
      width: ${props.width};
    `}

  ${props => {
    if (props.hasIcon) {
      return css`
        padding-left: 0;
      `
    } else {
      return css`
        padding-left: ${get('space.2')};
      `
    }
  }}
  &:focus {
    outline: 0;
  }
`

const Wrapper = styled.span`
  display: inline-flex;
  align-items: stretch;
  min-height: 34px;
  font-size: ${get('fontSizes.2')};
  line-height: 20px;
  color: ${get('colors.gray.9')};
  vertical-align: middle;
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.gray.3')};
  border-radius: ${get('radii.1')};
  outline: none;
  box-shadow: ${get('shadows.formControl')};

  .TextInput-icon {
    align-self: center;
    color: ${get('colors.gray.4')};
    margin: 0 ${get('space.2')};
  }

  &:focus-within {
    border-color: ${get('colors.blue.4')};
    box-shadow: ${get('shadows.formControl')}, ${get('shadows.formControlFocus')};
  }

  ${sizeVariants}

  ${props =>
    props.block &&
    css`
      display: block;
      width: 100%;
    `}    

  // Ensures inputs don't zoom on mobile but are body-font size on desktop
  @media (max-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')};
  }
  ${COMMON};
  ${width}
`

TextInput.defaultProps = {theme}

TextInput.propTypes = {
  autocomplete: PropTypes.string,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  theme: PropTypes.object,
  value: PropTypes.string,
  variant: PropTypes.oneOf(['small', 'large']),
  ...COMMON.propTypes,
  width: systemPropTypes.layout.width
}

export default TextInput
