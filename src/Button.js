import React from 'react'
import classnames from 'classnames'

const Button = props => (
    <button
      {...props}
      className={classnames(
        props.className,
        'btn', {
          'btn-sm': props.small,
          'btn-large': props.large,
        }
      )}
    />
)

export default Button
