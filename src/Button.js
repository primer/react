import React from 'react'
import classnames from 'classnames'

const Button = props => {
  const {
    block,
    children,
    disabled,
    linkStyle,
    onClick,
    scheme,
    size
  } = props

  const className = classnames(
    {
      'btn': !linkStyle,
      'btn-link': linkStyle
    },
    scheme && `btn-${scheme}`,
    {
      'btn-sm': size === 'small',
      'btn-large': size === 'large',
      'btn-block': block,
    }
  )

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={className}
    >
      {children}
    </button>
  )
}

Button.withProps = overrides => {
  return props => <Button {...props} {...overrides} />
}

export default Button
