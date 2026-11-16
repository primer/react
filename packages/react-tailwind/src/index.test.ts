// eslint-disable-next-line import/no-namespace -- the test enumerates every Base UI export
import * as BaseUI from '@base-ui/react'
import {describe, expect, it} from 'vitest'
// eslint-disable-next-line import/no-namespace -- the test enumerates every package export
import * as PrimerReactTailwind from './index'

const hasAttachedParts = (value: unknown) =>
  (typeof value === 'function' || (typeof value === 'object' && value !== null)) &&
  Object.keys(value).some(key => /^[A-Z]/.test(key))

describe('package exports', () => {
  it('gives every compound component its own root', () => {
    const owners = new Map<unknown, string>()
    const shared: string[] = []
    for (const [name, value] of Object.entries(PrimerReactTailwind)) {
      if (!hasAttachedParts(value)) continue
      const owner = owners.get(value)
      // `OverlayRoot` aliasing `Overlay` is the same component; only distinct components must not share a root.
      if (owner && !name.startsWith(owner)) shared.push(`${owner} and ${name}`)
      else if (!owner) owners.set(value, name)
    }
    expect(shared).toEqual([])
  })

  it('does not attach parts to Base UI exports', () => {
    const mutated: string[] = []
    for (const [namespace, parts] of Object.entries(BaseUI as Record<string, unknown>)) {
      if (typeof parts !== 'object' || parts === null) continue
      for (const [part, value] of Object.entries(parts)) {
        if (hasAttachedParts(value)) mutated.push(`${namespace}.${part}`)
      }
    }
    expect(mutated).toEqual([])
  })
})
