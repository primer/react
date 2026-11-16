import React from 'react'
import type {ActionListGroupProps} from './Group'

type ContextProps = Pick<ActionListGroupProps, 'selectionVariant'> & {groupHeadingId: string | undefined}

export const GroupContext = React.createContext<ContextProps>({
  groupHeadingId: undefined,
  selectionVariant: undefined,
})
