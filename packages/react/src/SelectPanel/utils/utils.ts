import type {KeyboardEventHandler} from 'react'
import {isAlphabetKey} from '../../hooks/useMnemonics'
import {announce} from '@primer/live-region-element'

const SHORT_DELAY_MS = 500

export const preventBubbling =
  (customOnKeyDown: KeyboardEventHandler<HTMLDivElement> | undefined) =>
  (event: React.KeyboardEvent<HTMLDivElement>) => {
    // skip if a TextInput has focus
    customOnKeyDown?.(event)

    const activeElement = document.activeElement as HTMLElement
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') return

    // skip if used with modifier to preserve shortcuts like ⌘ + F
    const hasModifier = event.ctrlKey || event.altKey || event.metaKey
    if (hasModifier) return

    // skip if it's not the forward slash or an alphabet key
    if (event.key !== '/' && !isAlphabetKey(event.nativeEvent as KeyboardEvent)) {
      return
    }

    // if this is a typeahead event, don't propagate outside of menu
    event.stopPropagation()
  }

export async function announceText(text: string, delayMs = SHORT_DELAY_MS) {
  const liveRegion = document.querySelector('live-region')

  liveRegion?.clear() // clear previous announcements

  await announce(text, {
    delayMs,
    from: liveRegion ? liveRegion : undefined, // announce will create a liveRegion if it doesn't find one
  })
}

export async function announceLoading() {
  await announceText('Loading.')
}
