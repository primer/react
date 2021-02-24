import React from 'react'

export interface ActionListProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

export function ActionList(props: ActionListProps): JSX.Element {
  return <div {...props} />
}
