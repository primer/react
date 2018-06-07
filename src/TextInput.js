import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

const TextInput = ({
    autocomplete,
    autofocus,
    block,
    disabled,
    id,
    name,
    placeholder,
    required,
    size,
    value
  }) => (
  <input
    aria-label={placeholder}
    autocomplete={autocomplete}
    autofocus={autofocus}
    className={classnames(
      'form-control',
      {
        'input-block': block,
        'input-sm': size === 'small',
        'input-lg': size === 'large'
      }
    )}
    disabled={disabled}
    id={id}
    name={name}
    placeholder={placeholder}
    required={required}
    type='text'
    value={value}
  />
)

TextInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  name: PropTypes.string,
  autocomplete: PropTypes.string,
  autofocus: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large'])
}

export default TextInput
