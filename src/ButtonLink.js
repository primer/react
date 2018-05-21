import React from 'react'
import classnames from 'classnames'

const ButtonLink = ({ size, type, block, href, children }) => (
    <button
      href={href}
      role="button"
      className={classnames(
        'btn',
        {
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

export default ButtonLink
