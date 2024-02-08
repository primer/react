import React from 'react'
import Text from '../../Text'
import {SxProp} from '../../sx'

type Props = {
  /**
   * The unique identifier used to associate the caption with an input
   */
  id: string
  /**
   * Whether the input associated with this caption is disabled
   */
  disabled?: boolean
} & SxProp

const InputCaption: React.FC<React.PropsWithChildren<Props>> = ({children, disabled, id, sx}) => (
  <Text color={disabled ? 'fg.subtle' : 'fg.muted'} display="block" fontSize={0} id={id} sx={sx}>
    {children}
  </Text>
)

export default InputCaption
