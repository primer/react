import React from 'react'

export default function chameleon(defaultTag, mapProps, castable) {
  const Component = ({tag: Tag = defaultTag, ...props}) => <Tag {...mapProps(props)} />
  Component.withComponent = castable
    ? (tag, recastable) => chameleon(tag, mapProps, recastable)
    : tag => props => <Component {...props} tag={tag} />
  return Component
}
