import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import styled from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import {width} from 'styled-system'

injectGlobal(sass`
  @import "primer-buttons/index.scss";
`)

function proto({children, size, grouped, scheme, onClick, disabled, className, ...rest}) {
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
    <button {...rest} type="button" disabled={disabled} onClick={disabled ? undefined : onClick} className={classes}>
      {children}
    </button>
  )
}

const Button = styled(proto)`
  ${COMMON}
  ${width}
`

Button.defaultProps = {theme}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  ...COMMON.propTypes,
  ...width.propTypes
}

export default Button
