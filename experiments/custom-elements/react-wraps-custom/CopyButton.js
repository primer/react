import React from 'react'
import 'clipboard-copy-element'

export default ({children, ...props}) => (
  <clipboard-copy {...props}>
    {children}
  </clipboard-copy>
)
