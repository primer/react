import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const Input = ({
    autocomplete,
    autofocus,
    block,
    disabled,
    name,
    placeholder,
    required,
    size,
  }) => (
  <input
    type='text'
    name={name}
    className={classnames(
      'form-control',
      {
        'input-block': block,
        'input-sm': size === 'small',
        'input-lg': size === 'large'
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
  size: PropTypes.oneOf(['small', 'large'])
}

export default Input
