import React from 'react'
import {warning} from '../utils/warning'

/* slot config allows 2 options:
   1. Component to match, example: { leadingVisual: LeadingVisual }
   2. Component to match + a test function, example: { blockDescription: [Description, props => props.variant === 'block'] }
*/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlotConfig = Record<string, React.ElementType<any> | [React.ElementType<any>, (props: any) => boolean]>

type SlotElements<Config extends SlotConfig> = {
  [Property in keyof Config]: SlotValue<Config, Property>
}

type SlotValue<Config, Property extends keyof Config> = Config[Property] extends React.ElementType // config option 1
  ? React.ReactElement<React.ComponentPropsWithoutRef<Config[Property]>, Config[Property]>
  : Config[Property] extends readonly [
      infer ElementType extends React.ElementType, // config option 2, infer array[0] as component
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      infer testFn, // even though we don't use testFn, we need to infer it to support types for slots.*.props
    ]
  ? React.ReactElement<React.ComponentPropsWithoutRef<ElementType>, ElementType>
  : never

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
      if (Array.isArray(value)) {
        const [component, testFn] = value
        return child.type === component && testFn(child.props)
      } else {
        return child.type === value
      }
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
