
import {useEffect, useCallback} from 'react'

export type UseOnEscapePressProps = {
  onEscape: (e: KeyboardEvent) => void
}

export const useOnEscapePress = ({onEscape}: UseOnEscapePressProps): void => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        onEscape(e)
      }
    }, [onEscape]
  )
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape])
}