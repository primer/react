import {MutableRefObject, RefObject, useCallback, useRef, useState} from 'react'

/**
 * @type TRef The type of the RefObject which should be created.
 */
export function useRenderForcingRef<TRef>() {
  const [refCurrent, updateRefCurrent] = useState<TRef | null>(null)
  const ref = useRef<TRef>(null) as MutableRefObject<TRef | null>
  ref.current = refCurrent

  const updateRef = useCallback(
    (newRef: TRef | null) => {
      ref.current = newRef
      updateRefCurrent(newRef)
    },
    [ref]
  )
  return [ref as RefObject<TRef>, updateRef] as const
}
