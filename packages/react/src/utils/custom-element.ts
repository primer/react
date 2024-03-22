import React from 'react'
import styled from 'styled-components'
import type {EventName} from '@lit-labs/react'
import {createComponent as create} from '@lit-labs/react'
import sx, {type SxProp} from '../sx'
import type { d } from '@storybook/channels/dist/main-c55d8855'

export interface ElementRender {
  renderShadow(): string
  shadowRootOptions?: {
    shadowrootmode?: 'open' | 'closed'
    delegatesFocus?: boolean
  }
}

function hasShadow(elementClass: object): elementClass is ElementRender {
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

  if (hasShadow(elementClass)) {
    // Generate a key for the template
    const templateKey = Math.random().toString(36).slice(2)
    const divKey = Math.random().toString(36).slice(2)
    const dangerouslySetInnerHTML = {__html: elementClass.renderShadow()}
    // const div = React.createElement('div', {dangerouslySetInnerHTML, key: divKey})
    // const documentFragment = new DocumentFragment()
    // documentFragment.appendChild(div)
    return ({children, ...props}: React.ComponentProps<typeof Output> & SxProp) => {
      const {shadowrootmode = 'open', ...templateProps} = elementClass.shadowRootOptions || {}
      const template = React.createElement('template', {shadowrootmode, key: templateKey, dangerouslySetInnerHTML, ...templateProps})
      // @ts-ignore - Type instantiation is excessively deep and possibly infinite
      return React.createElement(Output, props, [template, ...children])
    }
  }

  return Output
}

export default createComponent
