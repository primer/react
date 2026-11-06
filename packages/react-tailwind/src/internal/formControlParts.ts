import type React from 'react'
import {isMarkedWith} from './regions'

const FORM_CONTROL_INPUT = Symbol('FormControl.Input')
const BASE_UI_CONTROL_ID = Symbol('FormControl.BaseUiControlId')
const BASE_UI_ACCESSIBLE_LABEL = Symbol('FormControl.BaseUiAccessibleLabel')
const matchesInput = isMarkedWith(FORM_CONTROL_INPUT)
const matchesBaseUiControlId = isMarkedWith(BASE_UI_CONTROL_ID)
const matchesBaseUiAccessibleLabel = isMarkedWith(BASE_UI_ACCESSIBLE_LABEL)

/** Identifies package inputs without importing them into FormControl. */
export function markFormControlInput(
  component: object,
  options?: {baseUiControlId?: boolean; baseUiAccessibleLabel?: boolean},
) {
  Object.defineProperty(component, FORM_CONTROL_INPUT, {value: true})
  if (options?.baseUiControlId) Object.defineProperty(component, BASE_UI_CONTROL_ID, {value: true})
  if (options?.baseUiAccessibleLabel) Object.defineProperty(component, BASE_UI_ACCESSIBLE_LABEL, {value: true})
}

export function isFormControlInput(child: React.ReactElement): child is React.ReactElement<{id?: string}> {
  return matchesInput(child)
}

export function usesBaseUiControlId(child: React.ReactElement): boolean {
  return matchesBaseUiControlId(child)
}

export function usesBaseUiAccessibleLabel(child: React.ReactElement): boolean {
  return matchesBaseUiAccessibleLabel(child)
}
