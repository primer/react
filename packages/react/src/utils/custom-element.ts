import React from 'react'
import styled from 'styled-components'
import type {EventName} from '@lit-labs/react'
import {createComponent as create} from '@lit-labs/react'
import sx, {type SxProp} from '../sx'

export interface ElementRender {
  renderShadow(): string
  shadowRootOptions?: {
    shadowrootmode?: 'open' | 'closed'
    delegatesFocus?: boolean
  }
}

function isElementRender(elementClass: unknown): elementClass is ElementRender {
  return 'renderShadow' in elementClass && typeof elementClass.renderShadow === 'function'
}

type EventNames = Record<string, EventName | string>
const rename = (str: string): string => str[0].toUpperCase() + str.slice(1).replace(/(-\w)/g, s => s[1].toUpperCase())
// eslint-disable-next-line @typescript-eslint/ban-types
export const createComponent = <I extends HTMLElement, E extends EventNames = {}>(
  elementClass: new () => I,
  tagName: string,
  events: E | undefined = undefined,
) => {
  const Output = Object.assign(
    styled(
      create<I, E>({
        tagName,
        elementClass,
        react: React,
        events,
      }),
    )(sx),
    {
      displayName: rename(tagName),
    },
  )

  if (isElementRender(elementClass)) {
    return ({children, ...props}: React.ComponentProps<typeof Output> & SxProp) => {
      const {shadowrootmode = 'open', ...templateProps} = elementClass.shadowRootOptions || {}
      return React.createElement(Output, props, [
        React.createElement('template', {shadowrootmode, ...templateProps}),
        ...children,
      ])
    }
  }

  return Output as React.ComponentType<React.ComponentProps<typeof Output> & SxProp>
}

export default createComponent
