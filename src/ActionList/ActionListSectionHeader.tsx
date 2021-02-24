import React from 'react'

export interface ActionListSectionHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

export function ActionListSectionHeader(props: ActionListSectionHeaderProps): JSX.Element {
  return <div {...props} />
}
