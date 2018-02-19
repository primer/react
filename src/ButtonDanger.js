import React from 'react'
import classnames from 'classnames'

const ButtonDanger = props => (
    <button
      {...props}
      className={classnames(
        props.className,
        'btn btn-danger', {
          'btn-sm': props.small,
          'btn-large': props.large,
        }
      )}
    />
)

export default ButtonDanger
