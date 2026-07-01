import React from 'react'

interface DependencyState<T> {
  dependencies: React.DependencyList
  signal: number
  value: T
}

export function areDependenciesEqual(
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

export function useDependencySignal(dependencies: React.DependencyList): number {
  return useValueWithDependencies(undefined, dependencies).signal
}

export function useValueWithDependencies<T>(value: T, dependencies: React.DependencyList): DependencyState<T> {
  const [state, setState] = React.useState<DependencyState<T>>(() => ({dependencies, signal: 0, value}))

  if (!areDependenciesEqual(state.dependencies, dependencies)) {
    const nextState = {
      dependencies,
      signal: state.signal + 1,
      value,
    }
    setState(nextState)
    return nextState
  }

  return state
}
