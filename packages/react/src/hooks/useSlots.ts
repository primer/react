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
  const slots: Partial<SlotElements<Config>> = {}

  // Array of elements that are not slots
  const rest: React.ReactNode[] = []

  const entries = Object.entries(config) as Array<[keyof Config, Config[keyof Config]]>

  // Set of slot keys that have already been filled, for O(1) duplicate detection
  const filledSlots = new Set<keyof Config>()

  // eslint-disable-next-line github/array-foreach
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      rest.push(child)
      return
    }

    let matchedKey: keyof Config | undefined

    for (const [key, value] of entries) {
      if (Array.isArray(value)) {
        const [component, testFn] = value
        if ((child.type === component || isSlot(child, component as SlotMarker)) && testFn(child.props)) {
          matchedKey = key
          break
        }
      } else {
        if (child.type === value || isSlot(child, value as SlotMarker)) {
          matchedKey = key
          break
        }
      }
    }

    if (matchedKey === undefined) {
      rest.push(child)
      return
    }

    // If slot is already filled, ignore duplicates
    if (filledSlots.has(matchedKey)) {
      warning(true, `Found duplicate "${String(matchedKey)}" slot. Only the first will be rendered.`)
      return
    }

    filledSlots.add(matchedKey)
    slots[matchedKey] = child as SlotValue<Config, keyof Config>
  })

  return [slots, rest]
}
