import type React from 'react'

/**
 * Base UI accepts state-aware styles. Layers component-owned properties over a
 * consumer's style, preserving a state callback when one is provided.
 */
export function mergeStyle<State>(
  style: React.CSSProperties | ((state: State) => React.CSSProperties | undefined) | undefined,
  extra: React.CSSProperties | undefined,
) {
  if (!extra) return style
  if (typeof style === 'function') return (state: State) => ({...style(state), ...extra})
  return {...style, ...extra}
}
