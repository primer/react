import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

const schemeMap = {
  octicon: 'Box-btn-octicon'
}

function getButtonClass({linkStyle, scheme}) {
  return linkStyle
    ? 'btn-link'
    : scheme ? schemeMap[scheme] || `btn btn-${scheme}` : 'btn'
}

export default function Button({
  block,
  children,
  disabled,
  grouped,
  label,
  linkStyle,
  octicon,
  onClick,
  scheme,
  size,
  tag: Tag = 'button',
  ...props
}) {
  const classes = classnames(
    getButtonClass({linkStyle, scheme}),
    size && `btn-${size}`,
    block && 'btn-block',
    grouped && 'BtnGroup-item'
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
