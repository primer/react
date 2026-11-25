import type React from 'react'
import {useEffect} from 'react'

const locks = new WeakMap<Document, {count: number; overflow: string}>()

function lockDocument(document: Document) {
  let lock = locks.get(document)
  if (!lock) {
    lock = {count: 0, overflow: document.body.style.overflow}
    locks.set(document, lock)
    document.body.style.overflow = 'hidden'
  }
  lock.count++
  return () => {
    lock.count--
    if (lock.count === 0) {
      document.body.style.overflow = lock.overflow
      locks.delete(document)
    }
  }
}

// Ref-counted so closing a nested panel cannot unlock its still-open parent.
export function useBodyScrollLock(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const document = ref.current?.ownerDocument
    if (!enabled || !document) return
    return lockDocument(document)
  }, [enabled, ref])
}
