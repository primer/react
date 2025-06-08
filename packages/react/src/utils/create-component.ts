import React, { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import styled from 'styled-components'
import sx from '../sx'

type WebComponentEventMap = Record<string, string>
const rename = (str: string): string =>
  str[0].toUpperCase() + str.slice(1).replace(/(-\w)/g, s => s[1].toUpperCase())
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const createComponent = <I extends HTMLElement, E extends WebComponentEventMap = {}>(
  elementClass: new () => I,
  tagName: string,
  events: E | undefined = undefined,
) => {
  const Component = forwardRef<I, Record<string, any>>((props, ref) => {
    const internalRef = useRef<I>(null)
    useImperativeHandle(ref, () => internalRef.current as I)
    useEffect(() => {
      const element = internalRef.current
      if (!element || !events) return

      const cleanupFunctions: (() => void)[] = []

      Object.keys(events).forEach(reactPropName => {
        const customEventName = events[reactPropName]
        const eventHandler = props[reactPropName]

        if (eventHandler && typeof eventHandler === 'function') {
          element.addEventListener(customEventName, eventHandler)
          cleanupFunctions.push(() => element.removeEventListener(customEventName, eventHandler))
        }
      })
      return () => {
        cleanupFunctions.forEach(cleanup => cleanup())
      }
    }, [props, events]) 
	
    const elementProps: Record<string, any> = { ...props }

    if (events) {
      Object.keys(events).forEach(propName => {
        delete elementProps[propName]
      })
    }

    return React.createElement(tagName, {
      ref: internalRef, 
      ...elementProps,
    })
  })

  const StyledComponent = styled(Component)(sx)
  StyledComponent.displayName = rename(tagName)

  return StyledComponent
}

export default createComponent
