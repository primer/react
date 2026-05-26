import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest'
import {asSlot} from '../as-slot'

function Source(props: React.PropsWithChildren<unknown>) {
  return <div {...props} />
}
Source.__SLOT__ = Symbol('Source')

function SourceWithoutMarker(props: React.PropsWithChildren<unknown>) {
  return <div {...props} />
}

describe('asSlot', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
  })

  test('copies the __SLOT__ marker from source to the wrapper component', () => {
    function Wrapper(props: React.PropsWithChildren<unknown>) {
      return <Source {...props} />
    }

    const wrapped = asSlot(Wrapper, Source)

    expect(wrapped).toBe(Wrapper)
    expect(wrapped.__SLOT__).toBe(Source.__SLOT__)
    expect(warnSpy).not.toHaveBeenCalled()
  })

  test('warns in dev when the source has no __SLOT__ marker', () => {
    function Wrapper(props: React.PropsWithChildren<unknown>) {
      return <SourceWithoutMarker {...props} />
    }

    asSlot(Wrapper, SourceWithoutMarker as unknown as Parameters<typeof asSlot>[1])

    expect(warnSpy).toHaveBeenCalledWith('Warning:', expect.stringMatching(/asSlot:/))
  })

  test('leaves an existing wrapper marker untouched when the source has no marker', () => {
    const existing = Symbol('existing')
    function Wrapper(props: React.PropsWithChildren<unknown>) {
      return <SourceWithoutMarker {...props} />
    }
    ;(Wrapper as unknown as {__SLOT__: symbol}).__SLOT__ = existing

    asSlot(Wrapper, SourceWithoutMarker as unknown as Parameters<typeof asSlot>[1])

    expect((Wrapper as unknown as {__SLOT__: symbol}).__SLOT__).toBe(existing)
  })
})
