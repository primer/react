import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextInput = ({
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
    aria-label={placeholder}
    autofocus={autofocus}
    required={required}
    disabled={disabled}
  />
)

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  autocomplete: PropTypes.string,
  autofocus: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large'])
}

export default TextInput
