import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const Input = ({
    autocomplete,
    autofocus,
    block,
    disabled,
    large,
    name,
    placeholder,
    required,
    small,
  }) => (
  <input
    type='text'
    name={name}
    className={classnames(
      'form-control',
      {
        'input-block': block,
        'input-sm': small,
        'input-lg': large
      }
    )}
    autocomplete={autocomplete}
    placeholder={placeholder}
    autofocus={autofocus}
    required={required}
    disabled={disabled}
  />
)

Input.propTypes = {
  name: PropTypes.string,
  autocomplete: PropTypes.string,
  autofocus: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  placeholder: PropTypes.string,
  small: PropTypes.bool,
  large: PropTypes.bool
}

export default Input
