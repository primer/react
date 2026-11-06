import React from 'react'

/** An icon given as a component, such as an Octicon, or as already-rendered content. */
export type IconSource = React.ElementType | React.ReactNode

/** Whether `icon` is a component (including `forwardRef`/`memo` objects) rather than rendered content. */
export function isIconComponent(icon: IconSource): icon is React.ElementType {
  return (
    typeof icon === 'function' ||
    (typeof icon === 'object' && icon !== null && '$$typeof' in icon && !React.isValidElement(icon))
  )
}

/** Renders a decorative icon from a component or passes rendered content through unchanged. */
export function renderIcon(icon: IconSource, className?: string): React.ReactNode {
  if (isIconComponent(icon)) {
    const Icon = icon
    return <Icon aria-hidden="true" className={className} />
  }
  return icon
}
