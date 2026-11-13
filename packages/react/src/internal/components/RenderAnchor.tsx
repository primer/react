import React from 'react'
import {useMergedRefs} from '../../hooks/useMergedRefs'
import {reactMajorVersion} from '../../utils/environment'
import {invariant} from '../../utils/invariant'
import {mergeAnchorProps, type AnchorProps} from '../utils/mergeAnchorProps'

export type AnchorRenderProps = React.HTMLAttributes<HTMLElement> & {ref: React.RefCallback<HTMLElement>}
export type AnchorRenderer = React.ReactElement<AnchorProps> | ((props: AnchorRenderProps) => React.ReactElement)

export function RenderAnchor({render, props}: {render: AnchorRenderer; props: AnchorProps}) {
  const element = typeof render === 'function' ? undefined : render
  invariant(
    typeof render === 'function' || (React.isValidElement(element) && element.type !== React.Fragment),
    '`renderAnchor` must render a single interactive element, not a React Fragment.',
  )
  const elementRef =
    reactMajorVersion > 18 ? element?.props.ref : (element as {ref?: AnchorProps['ref']} | undefined)?.ref
  const ref = useMergedRefs<HTMLElement>(props.ref, elementRef)
  if (typeof render === 'function') return render({...props, ref})

  const merged = mergeAnchorProps(props, render.props)
  return React.cloneElement(render, {
    ...merged,
    onClick: preventDisabledActivation(merged.onClick),
    onKeyDown: preventDisabledActivation(merged.onKeyDown),
    ref,
  })
}

function preventDisabledActivation<E extends React.SyntheticEvent<HTMLElement>>(handler?: (event: E) => void) {
  return (event: E) => {
    const isActivation = !('key' in event) || ['Enter', ' ', 'ArrowDown', 'ArrowUp'].some(key => event.key === key)
    if (
      isActivation &&
      (event.currentTarget.matches(':disabled') || event.currentTarget.getAttribute('aria-disabled') === 'true')
    ) {
      event.preventDefault()
      return
    }
    handler?.(event)
  }
}
