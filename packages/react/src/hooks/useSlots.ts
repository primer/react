import React from 'react'
import {warning} from '../utils/warning'
import {getSlotName} from '../utils/get-slot-name'

export type SlotConfig = Record<
  string,
  {type?: React.ElementType<Props>; slot?: string; props?: (props: Props) => boolean}
>

// We don't know what the props are yet, we set them later based on slot config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any

type SlotElements<Config extends SlotConfig> = {
  [Property in keyof Config]: SlotValue<Config, Property>
}

type SlotValue<Config, Property extends keyof Config> = Config[Property] extends {type: React.ElementType} // config option 1: has type property
  ? React.ReactElement<React.ComponentPropsWithoutRef<Config[Property]['type']>, Config[Property]['type']>
  : Config[Property] extends {slot: string} // config option 2: has slot property
    ? React.ReactElement<Record<string, unknown>, React.ElementType>
    : Config[Property] extends React.ElementType // config option 3: is a component type directly
      ? React.ReactElement<React.ComponentPropsWithoutRef<Config[Property]>, Config[Property]>
      : Config[Property] extends readonly [
            infer ElementType extends React.ElementType, // config option 4: array format
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            infer _testFn, // even though we don't use testFn, we need to infer it to support types for slots.*.props
          ]
        ? React.ReactElement<React.ComponentPropsWithoutRef<ElementType>, ElementType>
        : never // useful for narrowing types, other options are not possible

/**
 * Extract components from `children` so we can render them in different places,
 * allowing us to implement components with SSR-compatible slot APIs.
 * Note: We can only extract direct children, not nested ones.
 */
export function useSlots<Config extends SlotConfig>(
  children: React.ReactNode,
  config: Config,
): [Partial<SlotElements<Config>>, React.ReactNode[]] {
  // Object mapping slot names to their elements
  const slots: Partial<SlotElements<Config>> = mapValues(config, () => undefined)

  // Array of elements that are not slots
  const rest: React.ReactNode[] = []

  const keys = Object.keys(config) as Array<keyof Config>
  const values = Object.values(config)

  // eslint-disable-next-line github/array-foreach
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      rest.push(child)
      return
    }

    const index = values.findIndex(value => {
      // Check if child matches by type
      const typeMatch = value.type && value.type === child.type

      // Check if child matches by slot property (__SLOT__)
      const slotMatch = value.slot && getSlotName(child) === value.slot

      // Check if props condition is met (if provided)
      const propsMatch = !value.props || value.props(child.props)

      return (typeMatch || slotMatch) && propsMatch
    })

    // If the child is not a slot, add it to the `rest` array
    if (index === -1) {
      rest.push(child)
      return
    }

    const slotKey = keys[index]

    // If slot is already filled, ignore duplicates
    if (slots[slotKey]) {
      warning(true, `Found duplicate "${String(slotKey)}" slot. Only the first will be rendered.`)
      return
    }

    // If the child is a slot, add it to the `slots` object
    slots[slotKey] = child as SlotValue<Config, keyof Config>
  })

  return [slots, rest]
}

/** Map the values of an object */
function mapValues<T extends Record<string, unknown>, V>(obj: T, fn: (value: T[keyof T]) => V) {
  return Object.keys(obj).reduce(
    (result, key: keyof T) => {
      result[key] = fn(obj[key])
      return result
    },
    {} as Record<keyof T, V>,
  )
}
