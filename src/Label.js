import React from 'react'
import classnames from 'classnames'

const Label = props => (
    <span
      {...props}
      className={classnames(
        props.className,
        'Label', {
          'Label--gray': props.gray,
          'Label--orange': props.orange,
          'Label--gray-darker': props.graydarker,
        }
      )}
    >
      {props.children}
    </span>
)

export default Label
