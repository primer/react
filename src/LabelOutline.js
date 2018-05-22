import React from 'react'
import classnames from 'classnames'

const LabelOutline = props => (
    <span
      className={classnames(
        'Label Label--outline', {
          'Label--outline-green': props.green
        }
      )}
    >
      {props.children}
    </span>
)

export default LabelOutline
