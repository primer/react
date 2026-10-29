import {useEffect, useRef} from 'react'

type AnnounceOptions = {
  priority?: 'high' | 'normal'
  delayMs?: number
}

const defaultAnnounceOptions: AnnounceOptions = {}

export function useAnnounce() {
  const timeoutId = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    }
  }, [])

  return {
    announce(message: string, {priority = 'normal', delayMs}: AnnounceOptions = defaultAnnounceOptions) {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }

      if (priority === 'high') {
        document.ariaNotify(message, {
          priority: 'high',
        })
      } else if (typeof delayMs !== 'number') {
        document.ariaNotify(message, {
          priority: 'normal',
        })
      } else {
        timeoutId.current = window.setTimeout(() => {
          document.ariaNotify(message, {priority: 'normal'})
          timeoutId.current = null
        }, delayMs)
      }
    },
    cancel() {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current)
        timeoutId.current = null
      }
    },
  }
}
