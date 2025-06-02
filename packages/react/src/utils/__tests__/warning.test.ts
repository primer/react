import {describe, expect, it, vi} from 'vitest'
import {warning} from '../warning'

describe('warning', () => {
  it('emits a message to console.warn() when the condition is `true`', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

    warning(true, 'test')

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('Warning:', 'test')
    spy.mockRestore()
  })

  it('does not emit a message to console.warn() when the condition is `false`', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

    warning(false, 'test')

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('formats arguments into warning string', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {})

    warning(true, 'test %s %s %s', 1, 2, 3)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledWith('Warning:', 'test 1 2 3')
    spy.mockRestore()
  })
})
