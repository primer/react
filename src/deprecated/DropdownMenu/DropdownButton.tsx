import {TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import Octicon from '../../Octicon'
import Button, {ButtonProps} from '../Button/Button'

export type DropdownButtonProps = ButtonProps

/**
 * @deprecated Use Button with Octicons instead. See https://primer.style/react/drafts/Button2#appending-an-icon for more details.
 */
export const DropdownButton = React.forwardRef<HTMLElement, React.PropsWithChildren<DropdownButtonProps>>(
  ({children, ...props}: React.PropsWithChildren<DropdownButtonProps>, ref): JSX.Element => (
    <Button ref={ref} type="button" {...props}>
      {children}
      <Octicon icon={TriangleDownIcon} sx={{ml: 1}} />
    </Button>
  ),
)
