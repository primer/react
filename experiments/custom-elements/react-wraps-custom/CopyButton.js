import classnames from 'classnames'
import React from 'react'
import 'clipboard-copy-element'

export default ({buttonType, className, children, ...props}) => (
  <clipboard-copy className={
    classnames({'btn': true, [`btn-${buttonType}`]: buttonType, className})
  } {...props}>
    {children}
  </clipboard-copy>
)
