import React from 'react'
import classnames from 'classnames'

const LabelOutline = props => (
    <span
      {...props}
      className={classnames(
        props.className,
        'Label Label--outline', {
          'Label--outline-green': props.green
        }
      )}
    >
      {props.children}
    </span>
)

export default LabelOutline
