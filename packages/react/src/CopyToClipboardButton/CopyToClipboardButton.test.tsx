import {createRef} from 'react'
import {act, render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {announce} from '@primer/live-region-element'
import {CopyToClipboardButton} from './CopyToClipboardButton'
import {implementsClassName} from '../utils/testing'
import classes from './CopyToClipboardButton.module.css'

vi.mock('@primer/live-region-element', {spy: true})

describe('CopyToClipboardButton', () => {
  implementsClassName(CopyToClipboardButton, classes.Button)

  beforeEach(() => {
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined)
    vi.mocked(announce).mockClear().mockResolvedValue(undefined)
  })

  afterEach(() => vi.restoreAllMocks())

  it('confirms successful writes without changing the accessible name or focus', async () => {
    const onCopy = vi.fn()
    render(<CopyToClipboardButton textToCopy="hello" ariaLabel="Copy greeting" onCopy={onCopy} />)
    const button = page.getByRole('button', {name: 'Copy greeting', exact: true})
    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('data-copied')
    await expect.element(button).toHaveAccessibleName('Copy greeting')
    await expect.element(button).toHaveFocus()
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello')
    expect(onCopy).toHaveBeenCalledOnce()
    expect(announce).toHaveBeenCalledWith('Copied!')
    await userEvent.unhover(button)
    await userEvent.hover(button)
    await expect.element(page.getByText('Copied!', {exact: true})).toBeVisible()
    expect(page.getByRole('tooltip').all()).toHaveLength(0)
    await userEvent.click(button)
    await expect.poll(() => vi.mocked(announce).mock.calls.length).toBe(2)
  })

  it('does not report success until the write resolves', async () => {
    const write = Promise.withResolvers<void>()
    vi.mocked(navigator.clipboard.writeText).mockReturnValue(write.promise)
    const onCopy = vi.fn()
    render(<CopyToClipboardButton textToCopy="hello" onCopy={onCopy} />)
    const button = page.getByRole('button', {name: 'Copy to clipboard', exact: true})
    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('aria-busy', 'true')
    expect(onCopy).not.toHaveBeenCalled()
    expect(announce).not.toHaveBeenCalled()
    write.resolve()
    await expect.element(button).toHaveAttribute('data-copied')
    await expect.poll(() => onCopy.mock.calls.length).toBe(1)
  })

  it('ignores stale announcements and callbacks when overlapping writes finish out of order', async () => {
    const first = Promise.withResolvers<void>()
    const second = Promise.withResolvers<void>()
    vi.mocked(navigator.clipboard.writeText).mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise)
    const onCopy = vi.fn()
    const onCopyError = vi.fn()
    render(<CopyToClipboardButton textToCopy="hello" onCopy={onCopy} onCopyError={onCopyError} />)
    const button = page.getByRole('button', {name: 'Copy to clipboard', exact: true})
    await userEvent.click(button)
    await userEvent.click(button)
    second.resolve()
    await expect.element(button).toHaveAttribute('data-copied')
    await act(async () => {
      first.reject(new Error('Older write failed'))
      await expect(first.promise).rejects.toThrow('Older write failed')
    })
    expect(announce).toHaveBeenCalledExactlyOnceWith('Copied!')
    expect(onCopy).toHaveBeenCalledOnce()
    expect(onCopyError).not.toHaveBeenCalled()
    await expect.element(button).not.toHaveAttribute('data-copy-error')
  })

  it('does not announce or call callbacks for a write that finishes after unmount', async () => {
    const write = Promise.withResolvers<void>()
    vi.mocked(navigator.clipboard.writeText).mockReturnValue(write.promise)
    const onCopy = vi.fn()
    const {unmount} = render(<CopyToClipboardButton textToCopy="hello" onCopy={onCopy} />)
    await userEvent.click(page.getByRole('button', {name: 'Copy to clipboard', exact: true}))
    unmount()
    await act(async () => {
      write.resolve()
      await write.promise
    })
    expect(announce).not.toHaveBeenCalled()
    expect(onCopy).not.toHaveBeenCalled()
  })

  it.each([
    {name: 'keybindingHint', keybindingHint: 'Control+C', keyshortcuts: undefined},
    {name: 'keyshortcuts', keybindingHint: undefined, keyshortcuts: 'Control+C'},
  ])('supports descriptions and inherited $name', async ({keybindingHint, keyshortcuts}) => {
    render(
      <CopyToClipboardButton
        textToCopy="hello"
        ariaLabel="Copy greeting"
        description="Copy the greeting text"
        keybindingHint={keybindingHint}
        keyshortcuts={keyshortcuts}
      />,
    )
    const button = page.getByRole('button', {name: 'Copy greeting', exact: true})
    if (keyshortcuts) {
      await expect.element(button).toHaveAttribute('aria-keyshortcuts', keyshortcuts)
    }
    const descriptionId = button.element().getAttribute('aria-describedby')
    if (descriptionId === null) throw new Error('Expected a tooltip description')
    expect(document.getElementById(descriptionId)).toHaveTextContent('Copy the greeting text')
    await userEvent.hover(button)
    await expect.element(page.getByTestId('keybinding-hint')).toBeVisible()
  })

  it('announces failure and permits a successful retry', async () => {
    const error = new Error('Permission denied')
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error)
    const onCopy = vi.fn()
    const onCopyError = vi.fn()
    render(
      <CopyToClipboardButton
        textToCopy="hello"
        onCopy={onCopy}
        onCopyError={onCopyError}
        errorMessage="Copy failed"
        copiedMessage="Text copied"
      />,
    )
    const button = page.getByRole('button', {name: 'Copy to clipboard', exact: true})
    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('data-copy-error')
    expect(onCopy).not.toHaveBeenCalled()
    expect(onCopyError).toHaveBeenCalledWith(error)
    expect(announce).toHaveBeenCalledWith('Copy failed')
    await userEvent.unhover(button)
    await userEvent.hover(button)
    await expect.element(page.getByText('Copy failed', {exact: true})).toBeVisible()
    await userEvent.click(button)
    await expect.element(button).toHaveAttribute('data-copied')
    await expect.element(button).not.toHaveAttribute('data-copy-error')
    expect(announce).toHaveBeenCalledWith('Text copied')
    expect(onCopy).toHaveBeenCalledOnce()
  })

  it('supports keyboard copying, refs, and root attributes', async () => {
    const ref = createRef<HTMLButtonElement>()
    render(<CopyToClipboardButton ref={ref} textToCopy="keyboard" className="custom" id="copy-button" />)
    const button = page.getByRole('button', {name: 'Copy to clipboard', exact: true})
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    await expect.element(button).toHaveAttribute('data-copied')
    expect(ref.current).toBe(button.element())
    await expect.element(button).toHaveAttribute('id', 'copy-button')
    await expect.element(button).toHaveClass('custom')
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('keyboard')
  })

  it('keeps a disabled button named without copying or displaying a tooltip', async () => {
    render(<CopyToClipboardButton textToCopy="hello" disabled />)
    const button = page.getByRole('button', {name: 'Copy to clipboard', exact: true})
    await expect.element(button).toBeDisabled()
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled()
    expect(announce).not.toHaveBeenCalled()
    expect(page.getByRole('tooltip').all()).toHaveLength(0)
  })
})
