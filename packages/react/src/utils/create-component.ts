import React from 'react'
import type {EventName} from '@lit-labs/react'
import {createComponent as create} from '@lit-labs/react'

type EventNames = Record<string, EventName | string>
const rename = (str: string): string => str[0].toUpperCase() + str.slice(1).replace(/(-\w)/g, s => s[1].toUpperCase())
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const createComponent = <I extends HTMLElement, E extends EventNames = {}>(
  elementClass: new () => I,
  tagName: string,
  events: E | undefined = undefined,
) => {
  const component = create<I, E>({
    tagName,
    elementClass,
    react: React,
    events,
  })

  component.displayName = rename(tagName)

  return component
}

export default createComponent
