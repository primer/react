import React from 'react'
import {Text} from '.'

interface Props {
  /**
   * The unique identifier used to associate the caption with an input
   */
  id: string
  /**
   * Whether the input associated with this caption is disabled
   */
  disabled?: boolean
}

const InputCaption: React.FC<Props> = ({children, disabled, id}) => (
  <Text color={disabled ? 'fg.subtle' : 'fg.muted'} fontSize={0} id={id}>
    {children}
  </Text>
)

export default InputCaption
