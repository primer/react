import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import {withSystemProps, COMMON} from './system-props'

function TextInput({autocomplete, block, className, disabled, id, name, onChange, placeholder, required, size, value}) {
  const classes = classnames(className, 'form-control', {
    'input-block': block,
    'input-sm': size === 'small',
    'input-lg': size === 'large'
  })
  const inputProps = {
    className: classes,
    'aria-label': placeholder,
    autoComplete: autocomplete,
    onChange,
    disabled,
    id,
    name,
    placeholder,
    required,
    value,
    type: 'text'
  }
  return <input {...inputProps} />
}

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
  value: PropTypes.string
}

export default withSystemProps(TextInput, COMMON)
