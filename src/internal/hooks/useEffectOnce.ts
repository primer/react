import {useEffect, useRef, type EffectCallback} from 'react'

export function useEffectOnce(callback: EffectCallback) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    return savedCallback.current()
  }, [])
}
