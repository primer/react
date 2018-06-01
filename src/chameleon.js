import React from 'react'
import {componentWithProps} from './props'

export default function chameleon(defaultTag, mapProps, castable) {
  const Component = ({tag: Tag = defaultTag, ...props}) => <Tag {...mapProps(props)} />
  if (castable) {
    Component.withComponent = (tag, recastable) => chameleon(tag, mapProps, recastable)
  }
  Component.withProps = props => componentWithProps(Component, props)
  return Component
}
