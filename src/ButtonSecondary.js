import React from 'react'
import classnames from 'classnames'

const ButtonSecondary = props => (
    <button
      {...props}
      className={classnames(
        props.className,
        'btn btn-secondary', {
          'btn-sm': props.small,
          'btn-large': props.large,
        }
      )}
    />
)

export default ButtonSecondary
