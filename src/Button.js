import React from 'react'
import classnames from 'classnames'

const Button = ({
  block,
  children,
  disabled,
  linkStyle,
  onClick,
  scheme,
  size
}) => (
    <button
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      type="button"
      className={classnames(
        linkStyle ? 'btn-link' : 'btn',
        scheme ? `btn-${scheme}` : null,
        {
          'btn-sm': size === 'small',
          'btn-large': size === 'large',
          'btn-block': block,
        }
      )}
    >
      {children}
    </button>
)

export default Button
