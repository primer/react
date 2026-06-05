import React from 'react'

export type GroupContextProps = {
  selectionVariant?: 'single' | 'radio' | 'multiple' | false
  groupHeadingId: string | undefined
}

export const GroupContext = React.createContext<GroupContextProps>({
  groupHeadingId: undefined,
  selectionVariant: undefined,
})
