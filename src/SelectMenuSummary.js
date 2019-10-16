import React from 'react'
import Button from './Button'

const SelectMenuSummary = ({children, ...rest}) => (
  <Button as="summary" {...rest}>
    {children}
  </Button>
)

export default SelectMenuSummary
