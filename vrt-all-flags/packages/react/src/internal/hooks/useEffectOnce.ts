import {useEffect, useRef} from 'react'

export function useEffectOnce(callback: () => void) {
  const savedCallback = useRef(callback)
  const called = useRef(false)

  useEffect(() => {
    if (called.current === true) {
      return
    }

    called.current = true
    savedCallback.current()
  }, [])
}
