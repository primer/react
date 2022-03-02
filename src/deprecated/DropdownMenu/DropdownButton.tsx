import React from 'react'
import {TriangleDownIcon} from '@primer/octicons-react'
import Button, {ButtonProps} from '../Button/Button'
import StyledOcticon from '../../StyledOcticon'

export type DropdownButtonProps = ButtonProps

/**
 * @deprecated Use Button with Octicons instead. See https://primer.style/react/drafts/Button2#appending-an-icon for more details.
 */
export const DropdownButton = React.forwardRef<HTMLElement, React.PropsWithChildren<DropdownButtonProps>>(
  ({children, ...props}: React.PropsWithChildren<DropdownButtonProps>, ref): JSX.Element => (
    <Button ref={ref} type="button" {...props}>
      {children}
      <StyledOcticon icon={TriangleDownIcon} sx={{ml: 1}} />
    </Button>
  )
)
