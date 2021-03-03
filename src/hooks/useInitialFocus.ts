import { useEffect } from 'react'
import {initialFocus} from '../behaviors/initialFocus'
import { useProvidedRefOrCreate } from './useProvidedRefOrCreate'


type InitialFocusProps = {
  initialFocusRef?: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>
  isOpen: boolean
}

export function useInitialFocus({initialFocusRef, containerRef, isOpen}: InitialFocusProps) {
  const focusElement = initialFocusRef ? initialFocusRef.current : null
  const containerElement = useProvidedRefOrCreate(containerRef)
  useEffect(() => {
    initialFocus({initialFocusElement: focusElement, containerElement, isOpen})
  }, [isOpen, initialFocusRef, containerRef])
}