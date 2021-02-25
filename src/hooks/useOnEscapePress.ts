
import {useEffect, useCallback} from 'react'

export type UseOnEscapePressProps = {
  onEscape: (e: KeyboardEvent) => void
  isOpen: boolean
}

export const useOnEscapePress = ({onEscape, isOpen}: UseOnEscapePressProps): void => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape(e)
      }
    }, [onEscape]
  )
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, handleEscape])
}