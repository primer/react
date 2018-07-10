import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

export default function Button({
  block,
  children,
  disabled,
  grouped,
  label,
  linkStyle,
  onClick,
  scheme,
  size,
  tag: Tag = 'button',
  ...props
}) {
  const classes = classnames(
    linkStyle ? 'btn-link' : 'btn',
    size && `btn-${size}`,
    block && 'btn-block',
    grouped && 'BtnGroup-item',
    scheme && `btn-${scheme}`
  )

  return (
    <Tag
      {...props}
      aria-label={label}
      className={classes}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      type="button"
    >
      {children}
    </Tag>
  )
}

Button.propTypes = {
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  label: PropTypes.string,
  linkStyle: PropTypes.bool,
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  tag: PropTypes.oneOf(['button', 'a', 'summary'])
}
