import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import {withSystemProps, COMMON} from './system-props'

injectGlobal(sass`
  @import "primer-support/index.scss";
  @import "primer-forms/lib/form-control.scss";
`)

function TextInput({autocomplete, block, className, disabled, id, name, onChange, placeholder, required, size, value, ariaLabel}) {
  const classes = classnames(className, 'form-control', {
    'input-block': block,
    'input-sm': size === 'small',
    'input-lg': size === 'large'
  })
  const inputProps = {
    className: classes,
    'aria-label': ariaLabel || placeholder,
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
