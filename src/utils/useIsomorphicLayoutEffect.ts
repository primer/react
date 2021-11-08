import {useEffect, useLayoutEffect} from 'react'

export const useIsomorphicLayoutEffect: typeof useEffect = () => {
  return typeof window !== 'undefined' ? useLayoutEffect : useEffect
}
