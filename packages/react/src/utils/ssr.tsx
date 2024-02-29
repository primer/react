import type {PropsWithChildren} from 'react'
import {useId} from '../hooks/useId'

export function SSRProvider({children}: PropsWithChildren) {
  return children
}

export const useSSRSafeId = useId
