import React from 'react'
import {ChevronDownIcon} from '@primer/octicons-react'
import Button, {ButtonProps} from '../Button/Button'

export type DropdownButtonProps = ButtonProps

export const DropdownButton = React.forwardRef<HTMLElement, React.PropsWithChildren<DropdownButtonProps>>(
  ({children, ...props}: React.PropsWithChildren<DropdownButtonProps>, ref): JSX.Element => (
    <Button ref={ref} {...props}>
      {children}
      <ChevronDownIcon />
    </Button>
  )
)
