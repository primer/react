import React from 'react'

export default function chameleon(defaultTag, mapProps, castable) {
  const Component = ({tag: Tag = defaultTag, ...props}) => <Tag {...mapProps(props)} />
  if (castable) {
    Component.withComponent = (tag, recastable, members) => {
      const Casted = chameleon(tag, mapProps, recastable)
      if (members) Object.assign(Casted, members)
      return Casted
    }
  }
  return Component
}
