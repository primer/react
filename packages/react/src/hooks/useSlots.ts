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
 * calls this 101 times per render).
 *
 * Once all slots are filled, remaining children skip matching entirely in
 * production (single integer comparison). In dev, we still scan for duplicates
 * to emit a warning.
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

// --- Types ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any
type ComponentMatcher = React.ElementType<Props>
type ComponentAndPropsMatcher = [ComponentMatcher, (props: Props) => boolean]

export type SlotConfig = Record<string, ComponentMatcher | ComponentAndPropsMatcher>

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

// --- Matching ---

/** Check if a child element matches a slot config entry, either by direct type comparison or slot symbol. */
function childMatchesSlot(child: React.ReactElement, slotValue: ComponentMatcher | ComponentAndPropsMatcher): boolean {
  if (Array.isArray(slotValue)) {
    const [component, testFn] = slotValue
    return (child.type === component || isSlot(child, component as SlotMarker)) && testFn(child.props)
  }
  return child.type === slotValue || isSlot(child, slotValue as SlotMarker)
}

// --- Hook ---

/** Extract slot components from children. See file header for details. */
export function useSlots<Config extends SlotConfig>(
  children: React.ReactNode,
  config: Config,
): [Partial<SlotElements<Config>>, React.ReactNode[]] {
  const rest: React.ReactNode[] = []
  const keys = Object.keys(config) as Array<keyof Config>
  const values = Object.values(config)
  const totalSlots = keys.length

  // Initialize all slot keys to undefined so callers can check `slots.x === undefined`
  const slots: Partial<SlotElements<Config>> = {} as Partial<SlotElements<Config>>
  for (let i = 0; i < totalSlots; i++) {
    slots[keys[i]] = undefined
  }

  let slotsFound = 0

  // eslint-disable-next-line github/array-foreach
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      rest.push(child)
      return
    }

    // Short-circuit: all slots filled, no more matching needed
    if (slotsFound === totalSlots) {
      if (__DEV__ && warnIfDuplicate(child, keys, values, totalSlots)) {
        return
      }
      rest.push(child)
      return
    }

    // Try to match child against a slot
    const matchedIndex = findMatchingSlot(child, values, totalSlots)

    if (matchedIndex === -1) {
      rest.push(child)
      return
    }

    const slotKey = keys[matchedIndex]

    // Duplicate: slot already filled by an earlier child
    if (slots[slotKey] !== undefined) {
      if (__DEV__) {
        warning(true, `Found duplicate "${String(slotKey)}" slot. Only the first will be rendered.`)
      }
      return
    }

    slots[slotKey] = child as SlotValue<Config, keyof Config>
    slotsFound++
  })

  return [slots, rest]
}

// --- Helpers ---

/**
 * Find the first slot config entry matching this child.
 * Returns the config index, or -1 if no match.
 */
function findMatchingSlot(
  child: React.ReactElement,
  values: Array<ComponentMatcher | ComponentAndPropsMatcher>,
  totalSlots: number,
): number {
  for (let i = 0; i < totalSlots; i++) {
    if (childMatchesSlot(child, values[i])) return i
  }
  return -1
}

/**
 * Dev-only: check if a child duplicates an already-filled slot.
 * Returns true (and warns) if a duplicate is found, false otherwise.
 * Used in the short-circuit path where all slots are already filled.
 */
function warnIfDuplicate(
  child: React.ReactElement,
  keys: Array<string | number | symbol>,
  values: Array<ComponentMatcher | ComponentAndPropsMatcher>,
  totalSlots: number,
): boolean {
  for (let i = 0; i < totalSlots; i++) {
    if (childMatchesSlot(child, values[i])) {
      warning(true, `Found duplicate "${String(keys[i])}" slot. Only the first will be rendered.`)
      return true
    }
  }
  return false
}
