import React from 'react'
import type {UnderlineNavItemProps} from './UnderlineNavItemsRegistry'

export const getValidChildren = (children: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.Children.toArray(children).filter(child => React.isValidElement(child)) as React.ReactElement<any>[]
}

export const isCurrent = (props: UnderlineNavItemProps) =>
  props['aria-current'] !== undefined && props['aria-current'] !== false && props['aria-current'] !== 'false'
