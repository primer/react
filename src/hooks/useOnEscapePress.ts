import {useEffect, useCallback} from 'react'

export type UseOnEscapePressSettings = {
  onEscape: (e: KeyboardEvent) => void
}

export const useOnEscapePress = ({onEscape}: UseOnEscapePressSettings): void => {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !e.defaultPrevented) {
        onEscape(e)
      }
    },
    [onEscape]
  )
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [handleEscape])
}
