import React from 'react'

export interface ActionListSectionDividerProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

export function ActionListSectionDivider(props: ActionListSectionDividerProps): JSX.Element {
  return <div {...props} />
}
