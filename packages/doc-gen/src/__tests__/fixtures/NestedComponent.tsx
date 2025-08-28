import React from 'react'

function SubComponent({foo}: {foo: string}) {
  return <div>{foo}</div>
}

function RootComponent({bar}: {bar: string}) {
  return <div>{bar}</div>
}

export const NestedComponent = Object.assign(RootComponent, {
  SubComponent,
})
