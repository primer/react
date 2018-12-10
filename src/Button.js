import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import sass from 'sass.macro'
import {injectGlobal} from 'emotion'
import styled, {createGlobalStyle} from 'styled-components'
import {COMMON} from './constants'
import theme from './theme'
import {width} from 'styled-system'

const GlobalStyles = createGlobalStyle`
  ${sass`
    @import "primer-buttons/index.scss";
  `}
`

// eslint-disable-next-line no-unused-vars
function ButtonBase({is: Tag, children, theme, size, grouped, scheme, onClick, disabled, className, ...rest}) {
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
    <React.Fragment>
      <GlobalStyles />
      <Tag {...rest} type="button" disabled={disabled} onClick={disabled ? undefined : onClick} className={classes}>
        {children}
      </Tag>
    </React.Fragment>
  )
}

const Button = styled(ButtonBase)`
  ${COMMON} ${width};
`

Button.defaultProps = {
  is: 'button',
  theme
}

Button.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  grouped: PropTypes.bool,
  is: PropTypes.oneOfType([PropTypes.oneOf(['button', 'a', 'summary', 'input']), PropTypes.func]),
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'large']),
  theme: PropTypes.object,
  ...COMMON.propTypes,
  ...width.propTypes
}

export default Button
