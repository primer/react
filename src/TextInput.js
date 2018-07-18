import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {mapWhitespaceProps} from './props'

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
  value,
  ...rest
}) => {
  const {className} = mapWhitespaceProps(rest)
  return (
    <input
      aria-label={placeholder}
      autoComplete={autocomplete}
      autoFocus={autofocus}
      className={classnames(className, 'form-control', {
        'input-block': block,
        'input-sm': size === 'small',
        'input-lg': size === 'large'
      })}
      disabled={disabled}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      type="text"
      value={value}
    />
  )
}

TextInput.propTypes = {
  autocomplete: PropTypes.string,
  autofocus: PropTypes.bool,
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'large']),
  value: PropTypes.string
}

export default TextInput
