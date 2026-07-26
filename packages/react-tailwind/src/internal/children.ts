'use client'

import React from 'react'

/**
 * Normalizes children into a flat list, unwrapping fragments so that compound parts stay
 * discoverable however an author chooses to group them.
 */
export function flattenChildren(children: React.ReactNode): React.ReactNode[] {
  return React.Children.toArray(children).flatMap(child => {
    if (React.isValidElement<{children?: React.ReactNode}>(child) && child.type === React.Fragment) {
      return flattenChildren(child.props.children)
    }
    return child
  })
}
