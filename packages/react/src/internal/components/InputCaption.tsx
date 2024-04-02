import React from 'react'
import type {FC, PropsWithChildren} from 'react'
import Text from '../../Text'
import type {SxProp} from '../../sx'

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

const InputCaption: FC<PropsWithChildren<Props>> = ({children, disabled, id, sx}) => (
  <Text color={disabled ? 'fg.subtle' : 'fg.muted'} display="block" fontSize={0} id={id} sx={sx}>
    {children}
  </Text>
)

export default InputCaption
