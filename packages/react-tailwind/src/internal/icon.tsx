import type React from 'react'

/** An icon given as a component, such as an Octicon, or as already-rendered content. */
export type IconSource = React.ElementType | React.ReactNode

export type AccessibleIconName =
  | {'aria-label': string; 'aria-labelledby'?: string}
  | {'aria-label'?: undefined; 'aria-labelledby': string}

/** Whether `icon` is a component (including `forwardRef`/`memo` objects) rather than rendered content. */
export function isIconComponent(icon: IconSource): icon is React.ElementType {
  return (
    typeof icon === 'function' ||
    (typeof icon === 'object' &&
      icon !== null &&
      '$$typeof' in icon &&
      [Symbol.for('react.forward_ref'), Symbol.for('react.memo'), Symbol.for('react.lazy')].some(
        type => type === icon.$$typeof,
      ))
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
