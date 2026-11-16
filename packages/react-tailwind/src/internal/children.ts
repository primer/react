'use client'

import React from 'react'

/**
 * Normalizes children into a flat list, unwrapping fragments so that compound parts stay
 * discoverable however an author chooses to group them.
 */
export function flattenChildren(children: React.ReactNode, keyPrefix = ''): React.ReactNode[] {
  return React.Children.toArray(children).flatMap(child => {
    if (!React.isValidElement<{children?: React.ReactNode}>(child)) return child
    if (child.type === React.Fragment) {
      return flattenChildren(child.props.children, `${keyPrefix}${String(child.key)}`)
    }
    // Prefix keys from nested fragments so they cannot collide with their siblings once flattened.
    return keyPrefix ? React.cloneElement(child, {key: `${keyPrefix}${String(child.key)}`}) : child
  })
}
