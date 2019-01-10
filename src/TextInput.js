import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {COMMON, get} from './constants'
import theme from './theme'

function TextInputBase({autocomplete, theme, size, block, className, ...rest}) {
  const classes = classnames(className, 'form-control', {
    'input-block': block,
    'input-sm': size === 'small',
    'input-lg': size === 'large'
  })
  const inputProps = {
    className: classes,
    autoComplete: autocomplete,
    type: 'text',
    ...rest
  }
  return <input {...inputProps} />
}

const TextInput = styled(TextInputBase)`
  min-height: 34px;
  padding: 6px ${get('space.2')}px;
  font-size: ${get('fontSizes.2')}px;
  line-height: 20px;
  color: ${get('colors.gray.9')};
  vertical-align: middle;
  background-color: ${get('colors.white')};
  background-repeat: no-repeat; // Repeat and position set for form states (success, error, etc)
  background-position: right 8px center; // For form validation. This keeps images 8px from right and centered vertically.
  border: 1px solid ${get('colors.gray.3')};
  border-radius: ${get('radii.1')}px;
  outline: none;
  box-shadow: ${get('shadows.formControl')};

  &:focus {
    border-color: ${get('blue.4')};
    outline: none;
    box-shadow: ${get('shadows.formControl')}, ${get('shadows.formControl.focus')};
  }

  &.input-sm {
    min-height: 28px;
    padding-top: 3px;
    padding-bottom: 3px;
    font-size: $font-size-small;
    line-height: 20px;
  }

  &.input-lg {
    padding: $spacer-1 10px;
    font-size: $h4-size;
  }

  &.input-block {
    display: block;
    width: 100%;
  }

  // Ensures inputs don't zoom on mobile but are body-font size on desktop
  @media (max-width: ${get('breakpoints.1')}) {
    font-size: ${get('fontSizes.1')}px;
  }
  ${COMMON}
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
  size: PropTypes.oneOf(['small', 'large']),
  theme: PropTypes.object,
  value: PropTypes.string,
  ...COMMON.propTypes
}

export default TextInput
