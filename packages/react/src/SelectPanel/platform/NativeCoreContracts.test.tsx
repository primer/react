import type React from 'react'
import {render} from '@testing-library/react'
import {afterEach, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {FeatureFlags} from '../../FeatureFlags'
import {SelectPanel} from '..'

afterEach(() => vi.restoreAllMocks())

function fixture(children: React.ReactNode) {
  return <FeatureFlags flags={{primer_react_select_panel_native_dialog: true}}>{children}</FeatureFlags>
}

it('retains the compatibility host when the native flag is omitted', async () => {
  render(
    <SelectPanel.Root defaultOpen>
      <SelectPanel.Overlay overlayProps={{'aria-label': 'Default hosting'}}>
        <SelectPanel.CloseButton />
      </SelectPanel.Overlay>
    </SelectPanel.Root>,
  )
  const host = page.getByRole('dialog', {name: 'Default hosting', exact: true})
  await expect.element(host).toBeVisible()
  expect(host.element()).not.toBeInstanceOf(HTMLDialogElement)
})

it.each([undefined, ''])('preserves the core warning for an unnamed native panel with aria-label=%j', async label => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const {unmount} = render(
    fixture(
      <SelectPanel.Root defaultOpen>
        <SelectPanel.Overlay overlayProps={{'aria-label': label}}>
          <SelectPanel.CloseButton />
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    ),
  )
  await expect.poll(() => warn.mock.calls.length).toBeGreaterThan(0)
  expect(warn).toHaveBeenCalledWith('Warning:', expect.stringContaining('No accessible name'))
  unmount()
})

it('preserves explicit heading semantics, callback-ref label registrations and the aria-label fallback', async () => {
  const content = (title: boolean) =>
    fixture(
      <SelectPanel.Root defaultOpen>
        <SelectPanel.Overlay overlayProps={{'aria-label': title ? undefined : 'Fallback name'}}>
          {title ? (
            <SelectPanel.Title as="h3" id="native-title">
              Visible title
            </SelectPanel.Title>
          ) : null}
          <SelectPanel.Description id="native-description">Native description</SelectPanel.Description>
          <SelectPanel.CloseButton />
        </SelectPanel.Overlay>
      </SelectPanel.Root>,
    )
  const {rerender} = render(content(true))
  const heading = page.getByRole('heading', {name: 'Visible title', level: 3})
  await expect.element(heading).toBeVisible()
  const host = page.getByRole('dialog')
  await expect.element(host).toHaveAccessibleName('Visible title')
  await expect.element(host).toHaveAttribute('aria-labelledby', 'native-title')
  await expect.element(host).toHaveAccessibleDescription('Native description')
  expect(document.getElementById('native-title')).toBe(heading.element())
  rerender(content(false))
  await expect.element(host).toHaveAccessibleName('Fallback name')
  expect(host.element()).not.toHaveAttribute('aria-labelledby')
  expect(document.getElementById('native-title')).toBeNull()
})

it('shares core scroll-lock ownership when a nested native modal closes', async () => {
  const overflow = document.body.style.overflow
  const {unmount} = render(
    <SelectPanel.Root defaultOpen>
      <SelectPanel.Overlay overlayProps={{'aria-label': 'Compatibility parent'}}>
        {fixture(
          <SelectPanel.Root>
            <SelectPanel.Trigger>Open native child</SelectPanel.Trigger>
            <SelectPanel.Overlay variant={{regular: 'modal'}}>
              <SelectPanel.Title>Native child</SelectPanel.Title>
              <SelectPanel.CloseButton aria-label="Close native child" />
            </SelectPanel.Overlay>
          </SelectPanel.Root>,
        )}
      </SelectPanel.Overlay>
    </SelectPanel.Root>,
  )
  await userEvent.click(page.getByRole('button', {name: 'Open native child', exact: true}))
  await expect.element(page.getByRole('dialog', {name: 'Native child', exact: true})).toBeVisible()
  expect(document.body.style.overflow).toBe('hidden')
  await userEvent.click(page.getByRole('button', {name: 'Close native child', exact: true}))
  await expect.element(page.getByRole('button', {name: 'Open native child', exact: true})).toHaveFocus()
  expect(document.body.style.overflow).toBe('hidden')
  unmount()
  expect(document.body.style.overflow).toBe(overflow)
})
