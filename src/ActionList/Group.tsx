import React from 'react'

export interface GroupProps extends React.ComponentPropsWithoutRef<'div'> {
  [key: string]: unknown
}

export function Group(props: GroupProps): JSX.Element {
  return <div data-component="ActionList.Group" {...props} />
}
