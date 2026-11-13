import type React from 'react'
import {clsx} from 'clsx'
import {mergeProps} from '../../utils/mergeProps'

export type AnchorProps = React.HTMLAttributes<HTMLElement> & {
  ref?: React.RefCallback<HTMLElement> | {readonly current: HTMLElement | null} | null
}

export function mergeAnchorProps(props: AnchorProps, elementProps: AnchorProps): AnchorProps {
  const labelledBy = mergeIds(elementProps['aria-labelledby'], props['aria-labelledby'])
  const describedBy = mergeIds(elementProps['aria-describedby'], props['aria-describedby'])
  return {
    ...mergeProps(props, elementProps, {eventHandlerOrder: 'consumer-first'}),
    className: clsx(elementProps.className, props.className) || undefined,
    ...(labelledBy ? {'aria-labelledby': labelledBy} : {}),
    ...(describedBy ? {'aria-describedby': describedBy} : {}),
  }
}

function mergeIds(first?: string, second?: string) {
  return [...new Set(`${first ?? ''} ${second ?? ''}`.split(/\s+/).filter(Boolean))].join(' ') || undefined
}
