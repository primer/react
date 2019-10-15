import React from 'react'
import Button from './Button'

export default ({children, ...rest}) => <Button as='summary' {...rest}>{children}</Button>
