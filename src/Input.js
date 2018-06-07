import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const Input = ({
    autocomplete,
    autofocus,
    block,
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
    autocomplete={autocomplete ? 'on' : 'off'}
    placeholder={placeholder}
    autofocus={autofocus}
    required={required}
  />
)

Input.propTypes = {
  name: PropTypes.string,
  autocomplete: PropTypes.bool,
  autofocus: PropTypes.bool,
  required: PropTypes.bool,
  block: PropTypes.bool,
  placeholder: PropTypes.string,
  small: PropTypes.bool,
  large: PropTypes.bool
}

export default Input
