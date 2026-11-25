import {afterEach, describe, expect, it, vi} from 'vitest'
import {copyText} from './copyText'

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('copyText', () => {
  it('writes plain text, including empty strings, with the Clipboard API', async () => {
    const write = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    await copyText('plain text\nsecond line')
    await copyText('')
    expect(write.mock.calls).toEqual([['plain text\nsecond line'], ['']])
  })

  it('propagates Clipboard API rejection instead of trying to bypass it', async () => {
    const error = new Error('Permission denied')
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(error)
    const fallback = vi.spyOn(document, 'execCommand')
    await expect(copyText('hello')).rejects.toBe(error)
    expect(fallback).not.toHaveBeenCalled()
  })

  it.each([true, false])('cleans up fallback copying and restores selection (success: %s)', async success => {
    vi.stubGlobal('navigator', {})
    const selected = document.createElement('div')
    selected.textContent = 'selected text'
    document.body.appendChild(selected)
    const selection = document.getSelection()!
    const range = document.createRange()
    range.selectNodeContents(selected)
    selection.removeAllRanges()
    selection.addRange(range)
    const fallback = vi.spyOn(document, 'execCommand').mockImplementation(command => {
      expect(command).toBe('copy')
      expect(selection.toString()).toBe('text to copy')
      return success
    })
    const childCount = document.body.childElementCount
    try {
      if (success) {
        await copyText('text to copy')
      } else {
        await expect(copyText('text to copy')).rejects.toThrow('could not copy')
      }
      expect(fallback).toHaveBeenCalledOnce()
      expect(document.body.childElementCount).toBe(childCount)
      expect(selection.toString()).toBe('selected text')
    } finally {
      selected.remove()
      selection.removeAllRanges()
    }
  })
})
