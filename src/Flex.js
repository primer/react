import React from 'react'
import classnames from './system-classnames'

const Flex = ({children, ...props}) => (
  <div className={classnames(props, 'd-flex')}>
    {children}
  </div>
)

export default Flex
