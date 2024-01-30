import React from 'react'
import observeRect from '@reach/observe-rect'
import {debounce} from 'lodash'

type ElementObserverArguments = {
  /** Element to observe */
  elementRef: React.RefObject<Element>
  /** Performance optimisation, only observe element if this condition is true */
  condition?: boolean
  /** Function to call when element's position or size changes. It's recommended to wrap this callback in React.useCallback */
  callback: (rect: DOMRect) => void
}
export const useElementObserver = ({elementRef, condition = true, callback}: ElementObserverArguments) => {
  // performance optimisation: when scrolling, callback is called on every animation frame, we don't want to change React state that fast
  const debouncedCallback = debounce(callback, 16, {maxWait: 16 * 2})

  React.useLayoutEffect(() => {
    if (condition === true && elementRef.current instanceof Element) {
      const rectObserver = observeRect(elementRef.current, elementRect => debouncedCallback(elementRect))
      rectObserver.observe()
      return () => rectObserver.unobserve()
    }
  }, [condition, elementRef, debouncedCallback])
}
