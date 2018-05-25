import React from 'react'

export default function chameleon(defaultTag, mapProps, castable) {
  const Component = ({tag: Tag = defaultTag, ...props}) => <Tag {...mapProps(props)} />
  if (castable) {
    Component.withComponent = (tag, recastable) => chameleon(tag, mapProps, recastable)
  }
  return Component
}
