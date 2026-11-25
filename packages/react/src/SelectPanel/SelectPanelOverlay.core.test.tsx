import React from 'react'
import {render} from '@testing-library/react'
import {describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {SelectPanel} from './SelectPanel'

describe('ordinary SelectPanel overlay', () => {
  it.each(['anchored', 'modal'] as const)('supports regular %s positioning and scroll restoration', async variant => {
    await page.viewport(1200, 800)
    const previous = document.body.style.overflow
    render(
      <SelectPanel.Root>
        <SelectPanel.Trigger>Open overlay</SelectPanel.Trigger>
        <SelectPanel.Overlay variant={{regular: variant}} overlayProps={{'aria-label': 'Options'}}>
          <SelectPanel.CloseButton />
          <SelectPanel.List aria-label="Items">
            <SelectPanel.Item value={1}>One</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    await userEvent.click(page.getByRole('button', {name: 'Open overlay', exact: true}))
    const dialog = page.getByRole('dialog', {name: 'Options', exact: true})
    await expect.element(dialog).toHaveAttribute('data-variant', variant)
    expect(document.body.style.overflow).toBe('hidden')
    await userEvent.keyboard('{Escape}')
    await expect.element(page.getByRole('button', {name: 'Open overlay', exact: true})).toHaveFocus()
    expect(document.body.style.overflow).toBe(previous)
  })

  it.each(['anchored', 'fullscreen', 'bottom-sheet'] as const)('supports narrow %s positioning', async narrow => {
    await page.viewport(390, 844)
    render(
      <SelectPanel.Root defaultOpen>
        <SelectPanel.Trigger>Responsive picker</SelectPanel.Trigger>
        <SelectPanel.Overlay variant={{narrow}} overlayProps={{'aria-label': 'Responsive options'}}>
          <SelectPanel.CloseButton />
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    await expect
      .element(page.getByRole('dialog', {name: 'Responsive options', exact: true}))
      .toHaveAttribute('data-variant', narrow)
  })

  it('keeps a controlled panel open when a close request is rejected', async () => {
    const onOpenChange = vi.fn()
    render(
      <SelectPanel.Root open onOpenChange={onOpenChange}>
        <SelectPanel.Trigger>Controlled picker</SelectPanel.Trigger>
        <SelectPanel.Overlay overlayProps={{'aria-label': 'Controlled options'}}>
          <SelectPanel.CloseButton />
          <SelectPanel.List aria-label="Items">
            <SelectPanel.Item value={1}>One</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    await expect.element(page.getByRole('dialog', {name: 'Controlled options', exact: true})).toBeVisible()
    await userEvent.click(page.getByRole('button', {name: 'Close', exact: true}))
    expect(onOpenChange).toHaveBeenCalledWith(false, 'close')
    await expect.element(page.getByRole('dialog', {name: 'Controlled options', exact: true})).toBeVisible()
  })

  it('warns for an unnamed open panel, including an empty aria-label', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(
      <SelectPanel.Root defaultOpen>
        <SelectPanel.Trigger>Unnamed picker</SelectPanel.Trigger>
        <SelectPanel.Overlay overlayProps={{'aria-label': ''}}>
          <SelectPanel.CloseButton />
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
    await expect.poll(() => warn.mock.calls.length).toBeGreaterThan(0)
    expect(warn).toHaveBeenCalledWith('Warning:', expect.stringContaining('No accessible name'))
    warn.mockRestore()
  })
})
