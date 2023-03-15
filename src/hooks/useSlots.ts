import React from 'react'

type SlotConfig = Record<string, React.ComponentType>

type SlotElements<Type extends SlotConfig> = {
  [Property in keyof Type]: React.ReactElement
}

/**
 * Extract components from `children` so we can render them in different places,
 * allowing us to implement components with SSR-compatible slot APIs.
 * Note: We can only extract direct children, not nested ones.
 */
export function useSlots<T extends SlotConfig>(
  children: React.ReactNode,
  config: T,
): [Partial<SlotElements<T>>, React.ReactNode[]] {
  // Object mapping slot names to their elements
  const slots: Partial<SlotElements<T>> = mapValues(config, () => undefined)

  // Array of elements that are not slots
  const rest: React.ReactNode[] = []

  // eslint-disable-next-line github/array-foreach
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      rest.push(child)
      return
    }

    // Check if the child is a slot
    const slotKey = getKeyByValue(config, child.type)

    if (slotKey && slots[slotKey]) {
      // If slot is already filled, ignore duplicates
      return
    }

    if (slotKey) {
      // If the child is a slot, add it to the `slots` object
      slots[slotKey] = child
      return
    }

    // If the child is not a slot, add it to the `rest` array
    rest.push(child)
  })

  return [slots, rest]
}

/** Map the values of an object */
function mapValues<T extends Record<string, unknown>, V>(obj: T, fn: (value: T[keyof T]) => V) {
  return Object.keys(obj).reduce((result, key: keyof T) => {
    result[key] = fn(obj[key])
    return result
  }, {} as Record<keyof T, V>)
}

/** Get the key of an object by its value */
function getKeyByValue<T extends Record<string, unknown>>(object: T, value: unknown): keyof T | undefined {
  const keys = Object.keys(object) as (keyof T)[]
  return keys.find(key => object[key] === value)
}
