import {type RefObject, useEffect, useState} from 'react'

export function useFocus() {
  const [focusTarget, setFocusTarget] = useState<HTMLElement | RefObject<HTMLElement> | null>(null)

  useEffect(() => {
    if (focusTarget === null) {
      return
    }

    if (focusTarget instanceof HTMLElement) {
      focusTarget.focus()
    } else {
      focusTarget.current?.focus()
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusTarget(null)
  }, [focusTarget])

  return setFocusTarget
}
