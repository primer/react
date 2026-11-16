import type {ComponentRenderFn, HTMLProps} from '@base-ui/react/types'
import React from 'react'
import {joinIdRefs} from './idRefs'

export function mergeRenderDescription<State>(
  render: React.ReactElement | ComponentRenderFn<HTMLProps, State> | undefined,
  describedBy: string | undefined,
  leadingId?: string,
): React.ReactElement | ComponentRenderFn<HTMLProps, State> | undefined {
  if (!render || !describedBy) return render

  const mergeElement = (element: React.ReactElement) => {
    if (!React.isValidElement<React.AriaAttributes>(element) || !('aria-describedby' in element.props)) return element
    return React.cloneElement(element, {
      'aria-describedby': joinIdRefs(leadingId, element.props['aria-describedby'], describedBy),
    })
  }

  return typeof render === 'function' ? (props, state) => mergeElement(render(props, state)) : mergeElement(render)
}
