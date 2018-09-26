import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import {injectGlobal} from 'emotion'
import {withSystemProps, COMMON} from './system-props'
// eslint-disable-next-line no-unused
import sass from 'sass.macro'

injectGlobal(sass`
  @import "primer-buttons/index.scss";
`)

function Button({is: Tag, children, size, block, linkStyle, grouped, scheme, onClick, disabled, className, ...rest}) {
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
  is: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  linkStyle: PropTypes.bool,
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large'])
}

export default withSystemProps(Button, COMMON)
