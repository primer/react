import {useCallback, useEffect, useRef, useState} from 'react'
import {copyText} from '../utils/copyText'
import useSafeTimeout from './useSafeTimeout'

export interface UseCopyToClipboardOptions {
  /** Duration of successful copy feedback, in milliseconds. @default 2000 */
  resetDelayMs?: number
}

export interface UseCopyToClipboardResult {
  /** Resolves after copying; rejects on failure and updates `error`. */
  copy: (text: string) => Promise<void>
  copied: boolean
  isCopying: boolean
  error: Error | null
}

/** Copy text from a user interaction and track its outcome. Does not announce feedback. */
export function useCopyToClipboard({resetDelayMs = 2000}: UseCopyToClipboardOptions = {}): UseCopyToClipboardResult {
  const [copied, setCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const mounted = useRef(false)
  const request = useRef(0)
  const timeout = useRef<number | undefined>(undefined)
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()

  useEffect(() => {
    const currentRequest = request
    mounted.current = true
    return () => {
      mounted.current = false
      currentRequest.current++
    }
  }, [])

  const copy = useCallback(
    async (text: string) => {
      const currentRequest = ++request.current
      if (timeout.current !== undefined) {
        safeClearTimeout(timeout.current)
      }
      if (mounted.current) {
        setCopied(false)
        setError(null)
        setIsCopying(true)
      }

      try {
        await copyText(text)
      } catch (cause) {
        const copyError = cause instanceof Error ? cause : new Error('Unable to copy to clipboard', {cause})
        if (mounted.current && currentRequest === request.current) {
          setError(copyError)
          setIsCopying(false)
        }
        throw copyError
      }

      if (mounted.current && currentRequest === request.current) {
        setCopied(true)
        setIsCopying(false)
        timeout.current = safeSetTimeout(() => {
          setCopied(false)
        }, resetDelayMs)
      }
    },
    [resetDelayMs, safeSetTimeout, safeClearTimeout],
  )

  return {copy, copied, isCopying, error}
}
