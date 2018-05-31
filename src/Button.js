import React from 'react'
import classnames from 'classnames'

const Button = ({ block, children, disabled, linkStyle, onClick, size }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    type="button"
    className={classnames(
      {
        'btn': !linkStyle,
        'btn-link': linkStyle,
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
