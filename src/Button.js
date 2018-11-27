import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {width} from 'styled-system'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import {COMMON} from './constants'

injectGlobal(sass`
  @import "primer-buttons/index.scss";
`)

function ButtonProto({is: Tag, children, size, grouped, scheme, onClick, disabled, className, ...rest}) {
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

const Button = styled(ButtonProto)`
  ${COMMON}
  ${width}
`

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
  size: PropTypes.oneOf(['sm', 'large']),
  ...COMMON.propTypes,
  ...width.propTypes
}

export default Button
