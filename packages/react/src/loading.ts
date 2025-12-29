import {useEffect, useState, type CSSProperties} from 'react'

type LoadingDelay = {
  /**
   * Apply a delay to a loading state. When true, applies a default delay of 1000ms. When a number is provided, applies that number (in milliseconds) as the delay.
   */
  delay?: boolean | number
}

const DEFAULT_DELAY_MS = 1000

function useLoadingVisibility(delay: LoadingDelay['delay']): {style: CSSProperties} {
  const [visible, setVisible] = useState(delay === undefined || delay === false)
  const style: CSSProperties = {
    animation: visible ? undefined : 'none',
    visibility: visible ? undefined : 'hidden',
  }

  useEffect(() => {
    if (delay === undefined || delay === false) {
      return
    }

    const delayMs = typeof delay === 'number' ? delay : DEFAULT_DELAY_MS
    const timeoutId = setTimeout(() => {
      setVisible(true)
    }, delayMs)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [delay])

  return {
    style,
  }
}

export {useLoadingVisibility}
export type {LoadingDelay}
