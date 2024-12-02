import React from 'react'
import styled from 'styled-components'
import type {EventName} from '@lit-labs/react'
import {createComponent as create} from '@lit-labs/react'
import sx from '../sx'

type EventNames = Record<string, EventName | string>
const rename = (str: string): string => str[0].toUpperCase() + str.slice(1).replace(/(-\w)/g, s => s[1].toUpperCase())
// eslint-disable-next-line @typescript-eslint/ban-types
export const createComponent = <I extends HTMLElement, E extends EventNames = {}>(
  elementClass: new () => I,
  tagName: string,
  events: E | undefined = undefined,
) => {
  const output = Object.assign(
    Object.assign(
      styled(
        create<I, E>({
          tagName,
          elementClass,
          react: React,
          events,
        }),
      ),
      {
        displayName: rename(tagName),
      },
    )(sx),
    {
      displayName: rename(tagName),
    },
  )

  return output
}

export default createComponent
