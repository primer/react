import React from 'react'
import {TriangleDownIcon} from '@primer/octicons-react'
import Button, {ButtonProps} from '../Button/Button'
import StyledOcticon from '../StyledOcticon'

export type DropdownButtonProps = ButtonProps

export const DropdownButton = React.forwardRef<HTMLElement, React.PropsWithChildren<DropdownButtonProps>>(
  ({children, ...props}: React.PropsWithChildren<DropdownButtonProps>, ref): JSX.Element => (
    <Button ref={ref} {...props}>
      {children}
      <StyledOcticon icon={TriangleDownIcon} ml={1} />
    </Button>
  )
)
