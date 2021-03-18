import React, {useEffect, useCallback} from 'react'

export type TouchOrMouseEvent = MouseEvent | TouchEvent

export type UseOnOutsideClickProps = {
  containerRef: React.RefObject<HTMLDivElement>
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  onClickOutside: (e: TouchOrMouseEvent) => void
}

type ShouldCallClickHandlerProps = {
  ignoreClickRefs?: React.RefObject<HTMLElement>[]
  containerRef: React.RefObject<HTMLDivElement>
  e: TouchOrMouseEvent
}

const shouldCallClickHandler = ({ignoreClickRefs, containerRef, e}: ShouldCallClickHandlerProps): boolean => {
  let shouldCallHandler = true

  // don't call click handler if the mouse event was triggered by an auxiliary button (right click/wheel button/etc)
  if (e instanceof MouseEvent && e.button > 0) {
    shouldCallHandler = false
  }

  // don't call handler if the click happened inside of the container
  if (containerRef && 'current' in containerRef && containerRef.current?.contains(e.target as Node)) {
    shouldCallHandler = false
    // don't call handler if click happened on an ignored ref
  } else if (ignoreClickRefs) {
    for (const ignoreRef of ignoreClickRefs) {
      if (ignoreRef && ignoreRef.current?.contains(e.target as Node)) {
        shouldCallHandler = false
        // if we encounter one, break early, we don't need to go through the rest
        break
      }
    }
  }
  return shouldCallHandler
}

export const useOnOutsideClick = ({containerRef, ignoreClickRefs, onClickOutside}: UseOnOutsideClickProps): void => {
  const onOutsideClickInternal = useCallback(
    (e: TouchOrMouseEvent) => {
      if (shouldCallClickHandler({ignoreClickRefs, containerRef, e})) {
        onClickOutside(e)
      }
    },
    [onClickOutside, containerRef, ignoreClickRefs]
  )

  useEffect(() => {
    document.addEventListener('click', onOutsideClickInternal)
    return () => {
      document.removeEventListener('click', onOutsideClickInternal)
    }
  }, [onOutsideClickInternal])
}
