import React from 'react'
import classnames from 'classnames'

const ButtonDanger = ({ size, disabled, block, linkStyle, onClick, item,  children }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={classnames(
        'btn-danger',
        {
          'btn': !linkStyle,
          'btn-link': linkStyle,
          'btn-sm': size === 'small',
          'btn-large': size === 'large',
          'btn-block': block,
          'BtnGroup-item': item
        }
      )}
    >
      {children}
    </button>
)

export default ButtonDanger
