import type React from 'react'
import {useEffect, useRef} from 'react'
import useLayoutEffect from '../../utils/useIsomorphicLayoutEffect'

function areDependencyListsEqual(
  previousDependencies: React.DependencyList,
  nextDependencies: React.DependencyList,
): boolean {
  if (previousDependencies.length !== nextDependencies.length) {
    return false
  }

  for (let i = 0; i < previousDependencies.length; i++) {
    if (!Object.is(previousDependencies[i], nextDependencies[i])) {
      return false
    }
  }

  return true
}

function runCleanup(cleanup: void | (() => void)): void {
  if (typeof cleanup === 'function') {
    cleanup()
  }
}

export function useDependencyListEffect(
  effect: React.EffectCallback,
  getDependencies: () => React.DependencyList,
): void {
  const cleanupRef = useRef<void | (() => void)>()
  const dependenciesRef = useRef<React.DependencyList | null>(null)

  useEffect(() => {
    const dependencies = getDependencies()

    if (dependenciesRef.current !== null && areDependencyListsEqual(dependenciesRef.current, dependencies)) {
      return
    }

    runCleanup(cleanupRef.current)
    dependenciesRef.current = dependencies
    cleanupRef.current = effect()
  })

  useEffect(() => {
    return () => {
      runCleanup(cleanupRef.current)
      cleanupRef.current = undefined
      dependenciesRef.current = null
    }
  }, [])
}

export function useDependencyListLayoutEffect(
  effect: React.EffectCallback,
  getDependencies: () => React.DependencyList,
): void {
  const cleanupRef = useRef<void | (() => void)>()
  const dependenciesRef = useRef<React.DependencyList | null>(null)

  useLayoutEffect(() => {
    const dependencies = getDependencies()

    if (dependenciesRef.current !== null && areDependencyListsEqual(dependenciesRef.current, dependencies)) {
      return
    }

    runCleanup(cleanupRef.current)
    dependenciesRef.current = dependencies
    cleanupRef.current = effect()
  })

  useLayoutEffect(() => {
    return () => {
      runCleanup(cleanupRef.current)
      cleanupRef.current = undefined
      dependenciesRef.current = null
    }
  }, [])
}
