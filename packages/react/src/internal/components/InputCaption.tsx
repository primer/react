import React from 'react'
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

const InputCaption: React.FC<React.PropsWithChildren<Props>> = ({children, disabled, id, sx}) => (
  <Text
    id={id}
    sx={{
      color: disabled ? 'var(--control-fgColor-disabled)' : 'var(--fgColor-muted)',
      display: 'block',
      fontSize: 0,
      ...sx,
    }}
  >
    {children}
  </Text>
)

export default InputCaption
