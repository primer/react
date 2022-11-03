import React from 'react'

type SlotConfig = Record<string, React.ComponentType>

type SlotElements<Type extends SlotConfig> = {
  [Property in keyof Type]: React.ReactElement
}

export function useSlots<T extends SlotConfig>(
  children: React.ReactNode,
  config: T
): [Partial<SlotElements<T>>, React.ReactNode[]] {
  const slots: Partial<SlotElements<T>> = mapValues(config, () => undefined)
  const rest: React.ReactNode[] = []

  // eslint-disable-next-line github/array-foreach
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      rest.push(child)
      return
    }

    const slotKey = getKeyByValue(config, child.type)

    if (slotKey && !slots[slotKey]) {
      slots[slotKey] = child
      return
    }

    rest.push(child)
  })

  return [slots, rest]
}

function mapValues<T extends Record<string, unknown>, V>(obj: T, fn: (value: T[keyof T]) => V) {
  return Object.keys(obj).reduce((result, key: keyof T) => {
    result[key] = fn(obj[key])
    return result
  }, {} as Record<keyof T, V>)
}

function getKeyByValue<T extends Record<string, unknown>>(object: T, value: unknown): keyof T | undefined {
  const keys = Object.keys(object) as (keyof T)[]
  return keys.find(key => object[key] === value)
}
