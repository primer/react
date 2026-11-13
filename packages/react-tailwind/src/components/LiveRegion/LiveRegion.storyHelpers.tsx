import {useEffect, useState} from 'react'

/** Mirrors the upstream live-region stories: the message changes every five seconds. */
export function useTickingMessage() {
  const [message, setMessage] = useState('Default message')

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(`Last updated at ${new Date().toLocaleTimeString()}`)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return message
}
