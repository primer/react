import React from 'react'

export interface ActionListSectionProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

export function ActionListSection(props: ActionListSectionProps): JSX.Element {
  return <div data-component="ActionListSection" {...props} />
}
