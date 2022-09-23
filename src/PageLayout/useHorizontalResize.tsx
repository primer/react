import React, {useEffect, useCallback, useState, RefObject} from 'react'

export function useHorizontalResize(
  enabled: boolean,
  panePosition: 'start' | 'end',
  paneRef: RefObject<HTMLDivElement>,
  storageKey?: string
) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [paneWidth, setPaneWidth] = useState<undefined | number>()

  useEffect(() => {
    let hasValue = false
    if (storageKey) {
      const storedWidth = window.localStorage.getItem(storageKey)
      if (storedWidth) {
        const number = parseInt(storedWidth, 10)
        if (!isNaN(number) && number > 0) {
          hasValue = true
          setPaneWidth(number)
        }
      }
    }

    if (!hasValue && paneRef.current) {
      setPaneWidth(paneRef.current.clientWidth)
    }
  }, [storageKey, setPaneWidth, paneRef])

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || e.button !== 0) return
      setIsDragging(true)
    },
    [enabled]
  )

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled || e.detail !== 2) return
      setPaneWidth(undefined)
      setIsDragging(false)
    },
    [enabled]
  )

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && paneRef.current) {
        setIsResizing(true)
        if (panePosition === 'start') {
          const clientLeft = paneRef.current.getBoundingClientRect().left
          const newSize = e.clientX - clientLeft
          setPaneWidth(newSize)
        } else {
          const clientRight = paneRef.current.getBoundingClientRect().right
          const newSize = clientRight - e.clientX
          console.log(newSize)
          setPaneWidth(newSize)
        }
        e.preventDefault()
      }
    },
    [isDragging, panePosition, paneRef]
  )

  const onMouseUp = useCallback(() => {
    const newPosition = paneRef.current ? paneRef.current.clientWidth : 0
    if (storageKey && newPosition) {
      window.localStorage.setItem(storageKey, newPosition.toString())
    }
    setIsDragging(false)
    setIsResizing(false)
  }, [paneRef, storageKey])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  })

  return {onMouseDown, onClick, isResizing, paneWidth}
}
