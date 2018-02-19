import React from 'react'
import classnames from 'classnames'

const ButtonPrimary = props => (
    <button
      {...props}
      className={classnames(
        props.className,
        'btn btn-primary', {
          'btn-sm': props.small,
          'btn-large': props.large,
        }
      )}
    />
)

export default ButtonPrimary
