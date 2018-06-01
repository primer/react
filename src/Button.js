import PropTypes from 'prop-types'
import React from 'react'
import chameleon from './chameleon'
import classnames from 'classnames'

const mapButtonProps = props => {
  const {
    block,
    children,
    disabled,
    linkStyle,
    onClick,
    scheme,
    size,
    type = 'button',
    ...rest
  } = props
  return {
    children,
    className: classnames(
      {
        'btn': !linkStyle,
        'btn-link': linkStyle
      },
      scheme && `btn-${scheme}`,
      {
        'btn-sm': size === 'small',
        'btn-large': size === 'large',
        'btn-block': block,
      }
    ),
    disabled,
    onClick: disabled ? undefined : onClick,
    type
  }
}

const Button = chameleon('button', mapButtonProps)

Button.propTypes = {
  block: PropTypes.bool,
  disabled: PropTypes.bool,
  linkStyle: PropTypes.bool,
  onClick: PropTypes.func,
  scheme: PropTypes.string,
  size: PropTypes.oneOf(['small', 'large']),
  type: PropTypes.string
}

export default Button

export {mapButtonProps}
