import React from 'react'
import classnames from './system-classnames'

const Box = ({children, ...props}) => (
  <div className={classnames(props)}>{children}</div>
)

export default Box
