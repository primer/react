import React from 'react'

export const asIs = props => props

export default function chameleon(defaultTag, mapProps = asIs) {
  /**
   * This sets Tag locally to `props.tag` (via destructuring) or
   * `defaultTag` if it's not set. The function returns an instance
   * of Tag with the rest of the props mapped by the `mapProps`
   * function.
   */
  return ({tag: Tag = defaultTag, ...props}) => (
    <Tag {...mapProps(props)} />
  )
}
