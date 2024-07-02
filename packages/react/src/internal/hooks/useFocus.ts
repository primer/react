import {type RefObject, useCallback, useEffect, useState} from 'react'

type FocusTarget = HTMLElement | RefObject<HTMLElement> | (() => HTMLElement | undefined)

export function useFocus() {
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null)

  useEffect(() => {
    if (focusTarget === null) {
      return
    }

    const element =
      typeof focusTarget === 'function'
        ? focusTarget()
        : focusTarget instanceof HTMLElement
        ? focusTarget
        : focusTarget.current

    element?.focus()

    setFocusTarget(null)
  }, [focusTarget])

  return useCallback((target: FocusTarget) => {
    setFocusTarget(() => target)
  }, [])
}
