import React from 'react'
import {warning} from '../utils/warning'
import {isSlot} from '../utils/is-slot'
import type {SlotMarker} from '../utils/types'

// slot config allows 2 options:
// 1. Component to match, example: { leadingVisual: LeadingVisual }
type ComponentMatcher = React.ElementType<Props>
// 2. Component to match + a test function, example: { blockDescription: [Description, props => props.variant === 'block'] }
type ComponentAndPropsMatcher = [ComponentMatcher, (props: Props) => boolean]

export type SlotConfig = Record<string, ComponentMatcher | ComponentAndPropsMatcher>

// We don't know what the props are yet, we set them later based on slot config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any

type SlotElements<Config extends SlotConfig> = {
  [Property in keyof Config]: SlotValue<Config, Property>
}

type SlotValue<Config, Property extends keyof Config> = Config[Property] extends React.ElementType // config option 1
  ? React.ReactElement<React.ComponentPropsWithoutRef<Config[Property]>, Config[Property]>
  : Config[Property] extends readonly [
        infer ElementType extends React.ElementType, // config option 2, infer array[0] as component
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _testFn, // even though we don't use testFn, we need to infer it to support types for slots.*.props
      ]
    ? React.ReactElement<React.ComponentPropsWithoutRef<ElementType>, ElementType>
    : never // useful for narrowing types, third option is not possible

/**
 * Extract components from `children` so we can render them in different places,
 * allowing us to implement components with SSR-compatible slot APIs.
 * Note: We can only extract direct children, not nested ones.
 */
export function useSlots<Config extends SlotConfig>(
  children: React.ReactNode,
  config: Config,
): [Partial<SlotElements<Config>>, React.ReactNode[]] {
  // Array of elements that are not slots
  const rest: React.ReactNode[] = []

  const keys = Object.keys(config) as Array<keyof Config>
  const values = Object.values(config)
  const totalSlots = keys.length

  // Object mapping slot names to their elements, initialized with undefined for each key
  const slots: Partial<SlotElements<Config>> = {} as Partial<SlotElements<Config>>
  for (let i = 0; i < totalSlots; i++) {
    slots[keys[i]] = undefined
  }

  // Pre-compute which slots use the [Component, testFn] matcher pattern
  // to avoid Array.isArray() checks in the hot inner loop
  const isArrayMatcher: boolean[] = new Array(totalSlots)
  for (let i = 0; i < totalSlots; i++) {
    isArrayMatcher[i] = Array.isArray(values[i])
  }

  let slotsFound = 0

  // eslint-disable-next-line github/array-foreach
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      rest.push(child)
      return
    }

    // Fast path: once all slots are filled, skip matching entirely in production.
    // In dev, check for duplicates to warn.
    if (slotsFound === totalSlots) {
      if (__DEV__) {
        for (let i = 0; i < totalSlots; i++) {
          if (isArrayMatcher[i]) {
            const [component, testFn] = values[i] as ComponentAndPropsMatcher
            if ((child.type === component || isSlot(child, component as SlotMarker)) && testFn(child.props)) {
              warning(true, `Found duplicate "${String(keys[i])}" slot. Only the first will be rendered.`)
              return
            }
          } else {
            if (child.type === values[i] || isSlot(child, values[i] as SlotMarker)) {
              warning(true, `Found duplicate "${String(keys[i])}" slot. Only the first will be rendered.`)
              return
            }
          }
        }
      }
      rest.push(child)
      return
    }

    let matchedIndex = -1
    for (let i = 0; i < totalSlots; i++) {
      if (isArrayMatcher[i]) {
        const [component, testFn] = values[i] as ComponentAndPropsMatcher
        if ((child.type === component || isSlot(child, component as SlotMarker)) && testFn(child.props)) {
          matchedIndex = i
          break
        }
      } else {
        if (child.type === values[i] || isSlot(child, values[i] as SlotMarker)) {
          matchedIndex = i
          break
        }
      }
    }

    // If the child is not a slot, add it to the `rest` array
    if (matchedIndex === -1) {
      rest.push(child)
      return
    }

    const slotKey = keys[matchedIndex]

    // If slot is already filled, ignore duplicates
    if (slots[slotKey] !== undefined) {
      if (__DEV__) {
        warning(true, `Found duplicate "${String(slotKey)}" slot. Only the first will be rendered.`)
      }
      return
    }

    // If the child is a slot, add it to the `slots` object
    slots[slotKey] = child as SlotValue<Config, keyof Config>
    slotsFound++
  })

  return [slots, rest]
}
