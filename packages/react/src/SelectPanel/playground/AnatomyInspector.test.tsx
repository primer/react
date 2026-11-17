import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {page, userEvent as browserUserEvent} from 'vitest/browser'
import {SelectPanelDemo} from './SelectPanelDemo'
import {defaultConfig} from './model'
import {ThemeProvider} from '../../ThemeProvider'
import {AnatomyInspector} from './AnatomyInspector'

describe('playground anatomy inspector', () => {
  it('keeps the Clippy image and bubble mounted and stationary while the inspected content changes', async () => {
    await page.viewport(1000, 800)
    render(
      <SelectPanelDemo
        config={{...defaultConfig, appearance: 3, anatomy: true, actions: true, multiple: true}}
        resetKey={0}
      />,
    )
    await expect.poll(() => document.querySelector<HTMLImageElement>('[data-anatomy-clippy]')?.naturalWidth).toBe(122)
    const image = document.querySelector<HTMLImageElement>('[data-anatomy-clippy]')
    const bubble = document.querySelector<HTMLElement>('[data-anatomy-callout]')
    if (!image || !bubble) throw new Error('Expected persistent Clippy anatomy')
    expect(image).toHaveAttribute('width', '122')
    expect(image).toHaveAttribute('height', '88')
    const imageBounds = image.getBoundingClientRect().toJSON()
    const bubbleBounds = bubble.getBoundingClientRect().toJSON()
    expect(bubble).toHaveTextContent('Hover or focus a part to explore its anatomy.')
    const expectPinned = () => {
      expect(document.querySelector('[data-anatomy-clippy]')).toBe(image)
      expect(document.querySelector('[data-anatomy-callout]')).toBe(bubble)
      expect(image.getBoundingClientRect().toJSON()).toEqual(imageBounds)
      expect(bubble.getBoundingClientRect().toJSON()).toEqual(bubbleBounds)
    }

    const trigger = page.getByRole('button', {name: 'copilot-tauri-app', exact: true})
    await browserUserEvent.hover(trigger)
    await expect.element(page.getByText('SelectPanel.Trigger', {exact: true})).toBeVisible()
    expectPinned()
    await browserUserEvent.click(trigger)
    const input = page.getByRole('combobox', {name: 'Search repositories', exact: true})
    await expect.element(input).toHaveFocus()
    await expect.element(page.getByText('SelectPanel.SearchInput', {exact: true})).toBeVisible()
    expectPinned()
    const visual = document.querySelector('[data-select-panel-part="Item.secondaryActions"]')
    if (!visual) throw new Error('Expected the item details icon')
    const bounds = visual.getBoundingClientRect()
    fireEvent.pointerMove(visual, {clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2})
    await expect.element(page.getByText('InfoIcon', {exact: true})).toBeVisible()
    expectPinned()
    await browserUserEvent.hover(page.getByRole('option', {name: /reforge/}))
    await expect.element(page.getByText('SelectPanel.Item', {exact: true})).toBeVisible()
    expectPinned()
    await browserUserEvent.keyboard('{Escape}')
    await expect.element(trigger).toHaveFocus()
    await expect.element(page.getByText('SelectPanel.Trigger', {exact: true})).toBeVisible()
    await browserUserEvent.click(page.getByText('Saved selection', {exact: true}))
    expectPinned()
    await expect.element(page.getByText('SelectPanel.Trigger', {exact: true})).toBeVisible()
  })

  it.each([
    {width: 1000, height: 800},
    {width: 375, height: 700},
  ])('uses the Clippy bubble and supplied image only for Windows 98 anatomy at $width px', async ({width, height}) => {
    await page.viewport(width, height)
    const config = {...defaultConfig, appearance: 3, anatomy: true}
    const {rerender} = render(
      <ThemeProvider colorMode="night">
        <SelectPanelDemo config={config} resetKey={0} />
      </ThemeProvider>,
    )
    await browserUserEvent.click(page.getByRole('button', {name: 'copilot-tauri-app', exact: true}))
    const input = page.getByRole('combobox', {name: 'Search repositories', exact: true})
    await expect.element(input).toHaveFocus()
    await expect.poll(() => document.querySelector<HTMLImageElement>('[data-anatomy-clippy]')?.naturalWidth).toBe(122)
    const image = document.querySelector<HTMLImageElement>('[data-anatomy-clippy]')
    const bubble = document.querySelector<HTMLElement>('[data-anatomy-callout]')
    if (!image || !bubble) throw new Error('Expected the Clippy anatomy treatment')
    expect(image).toHaveAttribute('alt', '')
    expect(image.closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true')
    expect(getComputedStyle(image).pointerEvents).toBe('none')
    expect(getComputedStyle(bubble).backgroundColor).toBe('rgb(255, 255, 204)')
    expect(getComputedStyle(bubble).color).toBe('rgb(0, 0, 0)')
    expect(getComputedStyle(bubble).fontFamily).toContain('Tahoma')
    await expect
      .poll(() => {
        const picture = image.getBoundingClientRect()
        const callout = bubble.getBoundingClientRect()
        return {
          right: Math.round(width - picture.right),
          bottom: Math.round(height - picture.bottom),
          bubbleInside: callout.left >= 0 && callout.right <= width && callout.top >= 0 && callout.bottom <= height,
          separate: callout.bottom <= picture.top - 16,
        }
      })
      .toEqual({right: 16, bottom: 16, bubbleInside: true, separate: true})
    await browserUserEvent.type(input, 'reforge')
    rerender(
      <ThemeProvider colorMode="day">
        <SelectPanelDemo config={config} resetKey={0} />
      </ThemeProvider>,
    )
    expect(getComputedStyle(bubble).backgroundColor).toBe('rgb(255, 255, 204)')
    expect(getComputedStyle(bubble).color).toBe('rgb(0, 0, 0)')
    rerender(
      <ThemeProvider colorMode="day">
        <SelectPanelDemo config={{...config, appearance: 0}} resetKey={0} />
      </ThemeProvider>,
    )
    expect(document.querySelector('[data-anatomy-clippy]')).toBeNull()
    expect(getComputedStyle(bubble).backgroundColor).toBe('rgb(255, 255, 255)')
    await expect.element(input).toHaveValue('reforge')
    await expect.element(input).toHaveFocus()
    rerender(
      <ThemeProvider colorMode="day">
        <SelectPanelDemo config={{...config, anatomy: false}} resetKey={0} />
      </ThemeProvider>,
    )
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
    expect(document.querySelector('[data-anatomy-clippy]')).toBeNull()
    await expect.element(input).toHaveFocus()
    await expect.element(input).toHaveValue('reforge')
  })

  it.each([0, 1, 2, 4, 5])('does not show Clippy for appearance %s', async appearance => {
    render(<SelectPanelDemo config={{...defaultConfig, appearance, anatomy: true}} resetKey={0} />)
    await browserUserEvent.hover(page.getByRole('button', {name: 'copilot-tauri-app', exact: true}))
    await expect.element(page.getByText('SelectPanel.Trigger', {exact: true})).toBeVisible()
    expect(document.querySelector('[data-anatomy-clippy]')).toBeNull()
  })

  it('does not show Clippy with Windows 98 anatomy disabled', async () => {
    render(<SelectPanelDemo config={{...defaultConfig, appearance: 3, anatomy: false}} resetKey={0} />)
    await browserUserEvent.hover(page.getByRole('button', {name: 'copilot-tauri-app', exact: true}))
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
    expect(document.querySelector('[data-anatomy-clippy]')).toBeNull()
  })

  it('supports scripted parts without pointer events or focus changes', async () => {
    const film = (part: 'Trigger' | 'SearchInput' | null) => (
      <>
        <button type="button">Playback</button>
        <button type="button" data-select-panel-part="Trigger" data-select-panel-owner="film">
          Open picker
        </button>
        <input aria-label="Film search" data-select-panel-part="SearchInput" data-select-panel-owner="film" />
        <AnatomyInspector owner="film" enabled scriptedPart={part} />
      </>
    )
    const {rerender} = render(film('Trigger'))
    screen.getByRole('button', {name: 'Playback'}).focus()
    await screen.findByText('SelectPanel.Trigger', {selector: '[data-anatomy-name]'})
    fireEvent.pointerMove(screen.getByRole('textbox', {name: 'Film search'}))
    expect(screen.getByText('SelectPanel.Trigger', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    rerender(film('SearchInput'))
    await screen.findByText('SelectPanel.SearchInput', {selector: '[data-anatomy-name]'})
    expect(screen.getByRole('button', {name: 'Playback'})).toHaveFocus()
    rerender(film(null))
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
  })

  it('inherits the host theme across its portal and responds to theme changes', async () => {
    await page.viewport(1000, 800)
    const user = userEvent.setup()
    const {rerender} = render(
      <ThemeProvider colorMode="night">
        <SelectPanelDemo config={{...defaultConfig, anatomy: true}} resetKey={0} />
      </ThemeProvider>,
    )
    await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
    await screen.findByText('SelectPanel.SearchInput', {selector: '[data-anatomy-name]'})
    const callout = document.querySelector('[data-anatomy-callout]')!
    expect(callout.closest('[data-color-mode]')).toHaveAttribute('data-color-mode', 'dark')
    expect(getComputedStyle(callout).backgroundColor).toBe('rgb(13, 17, 23)')
    rerender(
      <ThemeProvider colorMode="day">
        <SelectPanelDemo config={{...defaultConfig, anatomy: true}} resetKey={0} />
      </ThemeProvider>,
    )
    expect(callout.closest('[data-color-mode]')).toHaveAttribute('data-color-mode', 'light')
    expect(getComputedStyle(callout).backgroundColor).toBe('rgb(255, 255, 255)')
    expect(screen.getByRole('combobox')).toHaveFocus()
  })

  it('is off by default and adds no interactive annotation controls', async () => {
    const user = userEvent.setup()
    render(<SelectPanelDemo config={defaultConfig} resetKey={0} />)
    await user.hover(screen.getByRole('button', {name: 'copilot-tauri-app'}))
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
  })

  it('inspects hover and keyboard focus through the portaled overlay without disrupting selection', async () => {
    const user = userEvent.setup()
    render(<SelectPanelDemo config={{...defaultConfig, anatomy: true}} resetKey={0} />)
    const trigger = screen.getByRole('button', {name: 'copilot-tauri-app'})
    await user.hover(trigger)
    expect(await screen.findByText('SelectPanel.Trigger', {selector: '[data-anatomy-name]'})).toHaveAttribute(
      'data-variant',
      'default',
    )
    await user.click(trigger)
    const input = screen.getByRole('combobox', {name: 'Search repositories'})
    expect(input).toHaveFocus()
    expect(await screen.findByText('SelectPanel.SearchInput', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    await user.keyboard('{ArrowDown}')
    expect(input).toHaveFocus()
    expect(input).toHaveAttribute('aria-activedescendant', screen.getAllByRole('option')[1].id)
    expect(await screen.findByText('SelectPanel.SearchInput', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    await user.hover(screen.getByRole('option', {name: /reforge/}))
    expect(await screen.findByText('SelectPanel.Item', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    expect(screen.getByText('ActionList.Item', {selector: '[data-variant="default"]'})).toBeInTheDocument()
    expect(screen.getByText('Overlay > Content > List > Item')).toBeInTheDocument()
    expect(document.querySelector('[data-anatomy-callout]')?.parentElement).toHaveStyle({pointerEvents: 'none'})
    await user.click(screen.getByRole('option', {name: /reforge/}))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'reforge'})).toBeInTheDocument()
  })

  it('identifies the picker overlay without mislabelling a standard details Dialog as SelectPanel', async () => {
    const user = userEvent.setup()
    render(<SelectPanelDemo config={{...defaultConfig, anatomy: true, actions: true, multiple: true}} resetKey={0} />)
    await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
    fireEvent.pointerMove(screen.getByRole('dialog'))
    expect(await screen.findByText('SelectPanel.Overlay', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    const details = screen
      .getByRole('option', {name: /copilot-tauri-app/})
      .querySelector<HTMLElement>('[data-component="SelectPanel.Item.SecondaryAction"]')!
    const iconBounds = details
      .querySelector('[data-select-panel-part="Item.secondaryActions"]')!
      .getBoundingClientRect()
    fireEvent.pointerMove(details, {
      clientX: iconBounds.left + iconBounds.width / 2,
      clientY: iconBounds.top + iconBounds.height / 2,
    })
    expect(await screen.findByText('InfoIcon', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    await user.click(details)
    expect(screen.getByRole('dialog', {name: 'copilot-tauri-app'})).toBeInTheDocument()
    await user.hover(screen.getByRole('button', {name: 'Back to repositories'}))
    await waitFor(() => expect(document.querySelector('[data-anatomy-callout]')).toBeNull())
    expect(screen.queryByText('SelectPanel.BackButton', {selector: '[data-anatomy-name]'})).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: 'Back to repositories'}))
    expect(screen.getByRole('dialog', {name: 'Choose repositories'})).toBeInTheDocument()
  })

  it('removes annotations when disabled without closing or resetting the picker', async () => {
    const user = userEvent.setup()
    const {rerender} = render(<SelectPanelDemo config={{...defaultConfig, anatomy: true}} resetKey={0} />)
    await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
    await user.type(screen.getByRole('combobox'), 'reforge')
    expect(await screen.findByText('SelectPanel.SearchInput', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    rerender(<SelectPanelDemo config={defaultConfig} resetKey={0} />)
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
    expect(screen.getByRole('combobox')).toHaveValue('reforge')
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })

  it('keeps the callout inside a narrow viewport', async () => {
    await page.viewport(375, 700)
    const user = userEvent.setup()
    render(<SelectPanelDemo config={{...defaultConfig, anatomy: true}} resetKey={0} />)
    await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
    await screen.findByText('SelectPanel.SearchInput', {selector: '[data-anatomy-name]'})
    await waitFor(() => {
      const callout = document.querySelector('[data-anatomy-callout]')!.getBoundingClientRect()
      expect(callout.left).toBeGreaterThanOrEqual(0)
      expect(callout.right).toBeLessThanOrEqual(375)
      expect(callout.top).toBeGreaterThanOrEqual(0)
      expect(callout.bottom).toBeLessThanOrEqual(700)
    })
  })

  it('identifies configurable icons without making them intercept clicks or keyboard focus', async () => {
    await page.viewport(1000, 800)
    const user = userEvent.setup()
    const {rerender} = render(<SelectPanelDemo config={{...defaultConfig, anatomy: true}} resetKey={0} />)
    const trigger = screen.getByRole('button', {name: 'copilot-tauri-app'})
    const chevron = trigger.querySelector('[data-select-panel-part="Trigger.trailingAction"]')!
    const chevronBounds = chevron.getBoundingClientRect()
    fireEvent.pointerMove(trigger, {
      clientX: chevronBounds.left + chevronBounds.width / 2,
      clientY: chevronBounds.top + chevronBounds.height / 2,
    })
    expect(await screen.findByText('ChevronDownIcon', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    await user.click(trigger)
    const input = screen.getByRole('combobox')
    const visual = document.querySelector('[data-select-panel-part="SearchInput.leadingVisual"]')!
    const bounds = visual.getBoundingClientRect()
    fireEvent.pointerMove(input.parentElement!, {
      clientX: bounds.left + bounds.width / 2,
      clientY: bounds.top + bounds.height / 2,
    })
    expect(await screen.findByText('SearchIcon', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    expect(screen.getByText('TextInput', {selector: '[data-variant="default"]'})).toBeInTheDocument()
    expect(screen.getByText('Overlay > Content > SearchInput > leadingVisual')).toBeInTheDocument()
    expect(input).toHaveFocus()
    expect(visual).not.toHaveAttribute('tabindex')
    rerender(<SelectPanelDemo config={{...defaultConfig, anatomy: true, appearance: 2}} resetKey={0} />)
    expect(document.querySelector('[data-select-panel-part="SearchInput.leadingVisual"]')).toBeNull()
    await waitFor(() =>
      expect(screen.queryByText('SearchIcon', {selector: '[data-anatomy-name]'})).not.toBeInTheDocument(),
    )
    expect(input).toHaveFocus()
  })

  it('includes optional descriptions and trailing visuals in item anatomy', async () => {
    await page.viewport(1000, 800)
    const user = userEvent.setup()
    render(<SelectPanelDemo config={{...defaultConfig, anatomy: true, descriptions: true}} resetKey={0} />)
    await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
    await user.hover(screen.getByText('A desktop home for your coding companion.'))
    expect(await screen.findByText('ActionList.Description', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    const metadata = screen.getAllByText('TypeScript')[0]
    const metadataBounds = metadata.getBoundingClientRect()
    fireEvent.pointerMove(screen.getAllByRole('option')[0], {
      clientX: metadataBounds.left + metadataBounds.width / 2,
      clientY: metadataBounds.top + metadataBounds.height / 2,
    })
    expect(await screen.findByText('ActionList.TrailingVisual', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
  })
})
