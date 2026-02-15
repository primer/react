import React from 'react'
import {warning} from '../utils/warning'
import {isSlot} from '../utils/is-slot'
import type {SlotMarker} from '../utils/types'

/**
 * useSlots - Extract slot components from children for SSR-compatible slot APIs.
 *
 * Given a list of children and a config mapping slot names to component types,
 * separates children into two groups: matched slots and the rest.
 *
 *   Config: { leadingVisual: LeadingVisual, description: Description }
 *
 *   Children:             Matching:              Output:
 *   +----------------+                           slots = {
 *   | LeadingVisual  |   -> matches slot 0  -->    leadingVisual: <LeadingVisual />
 *   | "Project name" |   -> no match        -->    description: <Description />
 *   | Description    |   -> matches slot 1  -->  }
 *   | TrailingVisual |   -> no match        -->  rest = ["Project name", <TrailingVisual />]
 *   +----------------+
 *
 * Performance-sensitive: called per item in lists (e.g. 100-item ActionList
 * calls this 101 times per render). Key optimizations:
 *
 *   1. for-loop matching instead of findIndex (no closure allocation per child)
 *   2. Pre-computed isArrayMatcher[] (avoids Array.isArray in hot loop)
 *   3. Short-circuit: once all slots filled, skip matching entirely
 *      - In production: single integer comparison, straight to rest
 *      - In dev: scans for duplicates to warn, then to rest
 *
 *   Flow per child:
 *
 *   child ──> isValidElement? ──no──> rest[]
 *              |
 *             yes
 *              |
 *              v
 *          all slots filled? ──yes──> rest[] (prod)
 *              |                       |
 *             no                  [dev: check for
 *              |                   duplicate warning]
 *              v
 *          match against unfilled slots
 *              |
 *         found match? ──no──> rest[]
 *              |
 *             yes
 *              |
 *              v
 *          slots[key] = child, slotsFound++
 *
 * Slot config supports two matcher styles:
 *   1. Component reference:  { visual: LeadingVisual }
 *   2. Component + test fn:  { block: [Description, props => props.variant === 'block'] }
 */

// Slot config: Component reference, or [Component, testFn] tuple
type ComponentMatcher = React.ElementType<Props>
type ComponentAndPropsMatcher = [ComponentMatcher, (props: Props) => boolean]

export type SlotConfig = Record<string, ComponentMatcher | ComponentAndPropsMatcher>

// We don't know what the props are yet, we set them later based on slot config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any

type SlotElements<Config extends SlotConfig> = {
  [Property in keyof Config]: SlotValue<Config, Property>
}

type SlotValue<Config, Property extends keyof Config> = Config[Property] extends React.ElementType
  ? React.ReactElement<React.ComponentPropsWithoutRef<Config[Property]>, Config[Property]>
  : Config[Property] extends readonly [
        infer ElementType extends React.ElementType,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        infer _testFn,
      ]
    ? React.ReactElement<React.ComponentPropsWithoutRef<ElementType>, ElementType>
    : never

/** Extract slot components from children. See file header for details. */
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
