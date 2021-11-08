import { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicEffect = () => {
  return typeof window !== 'undefined' ? useLayoutEffect : useEffect
}