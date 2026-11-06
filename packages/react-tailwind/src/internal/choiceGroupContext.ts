'use client'

import React from 'react'
import {joinIdRefs} from './idRefs'
import {isPartOf, resolveRegions} from './regions'
import {useIsomorphicLayoutEffect} from './useIsomorphicLayoutEffect'

export type ChoiceGroupComponent = 'CheckboxGroup' | 'RadioGroup'

/** Parts that describe the group; the label is tracked by Base UI's `Fieldset` instead. */
type DescriptionPart = 'caption' | 'validation'

export interface ChoiceGroupContextValue {
  /** The group's own `disabled` prop, so nested controls can mute the parts Base UI does not reach. */
  disabled: boolean
  required: boolean
  labelId: string
  captionId: string
  validationId: string
  registerPart: (part: DescriptionPart, id: string) => () => void
}

export const ChoiceGroupContext = React.createContext<ChoiceGroupContextValue | null>(null)

export function useChoiceGroupContext() {
  return React.useContext(ChoiceGroupContext)
}

/**
 * Lets a caption or validation message describe its group even when a consumer wraps it, which
 * render-time detection cannot see. Directly rendered parts are already known during render, so
 * server-rendered markup is complete without waiting for this effect.
 */
export function useRegisterChoiceGroupPart(part: DescriptionPart, id: string | undefined) {
  const registerPart = useChoiceGroupContext()?.registerPart
  useIsomorphicLayoutEffect(() => (registerPart && id ? registerPart(part, id) : undefined), [registerPart, part, id])
}

interface ChoiceGroupOptions {
  children: React.ReactNode
  disabled: boolean
  id: string | undefined
  /** The group's own part components, so render-time detection can find them among `children`. */
  parts: Record<'label' | DescriptionPart, React.ElementType>
  required: boolean
  /** `role="group"` has no `aria-required`, so a checkbox group announces it with a description instead. */
  describeRequired: boolean
  'aria-describedby': string | undefined
}

function propId(element: React.ReactElement | undefined) {
  const id = (element?.props as {id?: unknown} | undefined)?.id
  return typeof id === 'string' ? id : undefined
}

/**
 * Shared wiring for `CheckboxGroup` and `RadioGroup`: deterministic part ids, the group's
 * accessible name and description, and the context its parts read.
 */
export function useChoiceGroup({
  children,
  describeRequired,
  disabled,
  id,
  parts,
  required,
  'aria-describedby': describedByProp,
}: ChoiceGroupOptions) {
  const generatedId = React.useId()
  const groupId = id ?? generatedId
  const {matched} = resolveRegions(children, {
    label: {match: isPartOf(parts.label), keep: true},
    caption: {match: isPartOf(parts.caption), keep: true},
    validation: {match: isPartOf(parts.validation), keep: true},
  })
  const [registered, setRegistered] = React.useState<Partial<Record<DescriptionPart, string>>>({})
  const registerPart = React.useCallback((part: DescriptionPart, partId: string) => {
    setRegistered(current => (current[part] === partId ? current : {...current, [part]: partId}))
    return () =>
      setRegistered(current => {
        if (current[part] !== partId) return current
        const remaining = {...current}
        delete remaining[part]
        return remaining
      })
  }, [])

  const labelId = propId(matched.label[0]) ?? `${groupId}-label`
  const captionId = propId(matched.caption[0]) ?? `${groupId}-caption`
  const validationId = propId(matched.validation[0]) ?? `${groupId}-validation`
  const requiredId = required && describeRequired ? `${groupId}-required` : undefined
  const describedBy = joinIdRefs(
    describedByProp,
    matched.validation.length > 0 ? validationId : registered.validation,
    matched.caption.length > 0 ? captionId : registered.caption,
    requiredId,
  )
  const context = React.useMemo(
    () => ({disabled, required, labelId, captionId, validationId, registerPart}),
    [captionId, disabled, labelId, registerPart, required, validationId],
  )

  return {
    context,
    /** The label's id when it is rendered directly; a wrapped label is found by `Fieldset` after mount. */
    labelId: matched.label.length > 0 ? labelId : undefined,
    describedBy,
    requiredId,
  }
}
