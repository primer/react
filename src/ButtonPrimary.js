import React from 'react'
import classnames from 'classnames'

const ButtonPrimary = ({ size, disabled, block, linkStyle, onClick, children }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={classnames(
        'btn-primary',
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

export default ButtonPrimary
