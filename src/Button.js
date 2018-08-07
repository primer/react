import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {withSystemProps, COMMON} from './system-props'

function Button({
  is: Tag,
  children,
  size,
  block,
  linkStyle,
  grouped,
  scheme,
  onClick,
  disabled,
  className,
  ...rest
}) {
  const classes = classnames(
    className,
    {
      btn: !linkStyle,
      'btn-link': linkStyle,
      'btn-sm': size === 'sm',
      'btn-large': size === 'large',
      'btn-block': block,
      'BtnGroup-item': grouped
    },
    scheme ? `btn-${scheme}` : null
  )

  return (
    <Tag {...rest} type="button" disabled={disabled} onClick={disabled ? undefined : onClick} className={classes}>
      {children}
    </Tag>
  )
}

Button.defaultProps = {
  is: 'button'
}

Button.propTypes = {
  block: PropTypes.bool,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  linkStyle: PropTypes.bool,
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  is: PropTypes.oneOf(['button', 'a', 'summary'])
}

export default withSystemProps(Button, COMMON)
