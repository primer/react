import React from 'react'
import classnames from 'classnames'

const ButtonOutline = ({ size, disabled, block, linkStyle, onClick, item, children }) => (
    <button
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={classnames(
        'btn-outline',
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

export default ButtonOutline
