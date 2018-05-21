import React from 'react'
import classnames from 'classnames'

const Button = ({ size, type, disabled, block, linkStyle, onClick, children }) => (
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
          'btn-primary': type === 'primary',
          'btn-danger': type === 'danger',
          'btn-outline': type === 'outline',
          'btn-block': block,
        }
      )}
    >
      {children}
    </button>
)

export default Button
