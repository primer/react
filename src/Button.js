import React from 'react'
import chameleon from './chameleon'
import classnames from 'classnames'

export const getButtonProps = props => {
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

const Button = chameleon('button', getButtonProps, true)

export default Button
