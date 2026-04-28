import {useEffect, useRef} from 'react'

export function useEffectOnce(callback: () => void) {
  const savedCallbackRef = useRef(callback)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current === true) {
      return
    }

    calledRef.current = true
    savedCallbackRef.current()
  }, [])
}
