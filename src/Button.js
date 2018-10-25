import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import {withSystemProps, COMMON} from './system-props'

injectGlobal(sass`
  @import "primer-buttons/index.scss";
`)

function Button({is: Tag, children, size, grouped, scheme, onClick, disabled, className, ...rest}) {
  const classes = classnames(
    className,
    'btn',
    {
      'btn-sm': size === 'sm',
      'btn-large': size === 'large',
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
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  is: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large'])
}

export default withSystemProps(Button, [...COMMON, 'width'])
