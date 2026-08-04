import {clsx} from 'clsx'
import type {Merge} from './types'

type EventHandler = (...args: unknown[]) => void
type ClassValue = Parameters<typeof clsx>[number]

/**
 * Applies our rules for merging props between two objects. This utility handles the following scenarios:
 *
 * - Merging `className` values
 * - Merging event handlers
 * - Merging `style` values
 *
 * In other cases, if a key exists in both `A` and `B` then the value in `B` will be used in the final result
 */
function mergeProps<A extends object, B extends object = A>(a: A, b: B): Merge<A, B> {
  const merged = {...a} as Record<string, unknown>

  for (const [key, value] of Object.entries(b)) {
    if (key in merged) {
      const existing = merged[key]

      if (key === 'className') {
        merged[key] = clsx(existing as ClassValue, value as ClassValue)
      } else if (isEventHandlerKey(key) && isEventHandler(existing) && isEventHandler(value)) {
        merged[key] = composeEventHandlers(existing, value)
      } else if (key === 'style') {
        merged[key] = mergeStyle(existing, value)
      } else {
        merged[key] = value
      }
    } else {
      merged[key] = value
    }
  }

  return merged as Merge<A, B>
}

function composeEventHandlers(a: EventHandler, b: EventHandler) {
  return (...args: Parameters<EventHandler>) => {
    a(...args)

    const event = args[0] as {defaultPrevented?: boolean} | undefined
    if (!event?.defaultPrevented) {
      b(...args)
    }
  }
}

function isEventHandlerKey(key: string) {
  return key.startsWith('on')
}

function isEventHandler(value: unknown): value is EventHandler {
  return typeof value === 'function'
}

function mergeStyle(a: unknown, b: unknown) {
  return {
    ...(isObject(a) ? a : {}),
    ...(isObject(b) ? b : {}),
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export {mergeProps}
