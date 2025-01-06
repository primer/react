import type {Merge} from '../utils/types/Merge'

type AString = {
  a: string
}

type BString = {
  b: string
}

type CString = {
  c: string
}

type CNumber = {
  c: number
}

type DOptionalString = {
  d?: string
}

export function canMergeTwoTypes(x: Merge<AString, BString>): {a: string; b: string} {
  return x
}

export function overridesAsExpected(x: Merge<CString, CNumber>): {c: number} {
  return x
}

export function optionalityIsPreservedInFirstParameter(x: Merge<DOptionalString, AString>): {d: number} {
  // @ts-expect-error: d is optional
  return x
}

export function optionalityIsPreservedInSecondParameter(x: Merge<DOptionalString, AString>): {d: number} {
  // @ts-expect-error: d is optional
  return x
}
