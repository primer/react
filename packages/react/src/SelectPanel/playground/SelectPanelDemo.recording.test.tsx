import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {SelectPanelDemo} from './SelectPanelDemo'
import {getPlaygroundRecordingFrame} from './playgroundRecording'

function demo(time: number) {
  const frame = getPlaygroundRecordingFrame(time)
  return <SelectPanelDemo config={frame.config} playback={frame.preview} resetKey={0} />
}

describe('Scripted playground preview', () => {
  it('does not steal focus from playback controls when the scripted picker opens or changes presentation', async () => {
    const fixture = (time: number) => (
      <>
        <button type="button">Host playback controls</button>
        {demo(time)}
      </>
    )
    const {rerender} = render(fixture(0))
    const controls = page.getByRole('button', {name: 'Host playback controls'})
    await userEvent.click(controls)
    for (const time of [800, 1_200, 8_000, 18_200, 20_000]) {
      rerender(fixture(time))
      expect(controls.element()).toHaveFocus()
    }
  })

  it('moves real anatomy callouts between the demonstrated parts and hides them during appearance changes', async () => {
    const {container, rerender} = render(demo(1_200))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('SelectPanel.SearchInput')
    rerender(demo(2_000))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('ActionList.Description')
    const highlight = document.querySelector<HTMLElement>('[data-anatomy-highlight]')!
    const description = container.ownerDocument.querySelector<HTMLElement>(
      '[data-select-panel-part="Item.description"]',
    )!
    expect(highlight.getBoundingClientRect().width).toBeCloseTo(description.getBoundingClientRect().width)
    rerender(demo(4_000))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('SelectPanel.Group')
    rerender(demo(8_000))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('SelectPanel.Footer')
    rerender(demo(11_000))
    expect(document.querySelector('[data-anatomy-highlight]')).not.toBeInTheDocument()
    expect(document.querySelector('[data-anatomy-callout]')).not.toBeInTheDocument()
    rerender(demo(15_800))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('SelectPanel.Item')
    expect(document.querySelector('[data-anatomy-callout]')).toHaveTextContent(
      "It looks like you're composing a picker!",
    )
    rerender(demo(17_000))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('SelectPanel.Trigger')
    rerender(demo(18_200))
    await expect.poll(() => document.querySelector('[data-anatomy-name]')?.textContent).toBe('SelectPanel.List')
    rerender(demo(23_000))
    expect(document.querySelector('[data-anatomy-highlight]')).not.toBeInTheDocument()
  })

  it('renders draft and saved selection from the timeline while preserving picker identity through styling', async () => {
    const {rerender} = render(demo(8_000))
    const trigger = page.getByRole('button', {name: '2 repositories', exact: true}).element()
    await expect
      .element(page.getByRole('option', {name: /copilot-agent-runtime/}))
      .toHaveAttribute('aria-selected', 'false')
    rerender(demo(9_000))
    expect(page.getByRole('button', {name: '2 repositories', exact: true}).element()).toBe(trigger)
    await expect
      .element(page.getByRole('option', {name: /copilot-agent-runtime/}))
      .toHaveAttribute('aria-selected', 'true')
    rerender(demo(10_000))
    expect(page.getByRole('button', {name: '3 repositories', exact: true}).element()).toBe(trigger)
    const search = page.getByLabelText('Search repositories').element()
    rerender(demo(11_000))
    expect(page.getByRole('button', {name: '3 repositories', exact: true}).element()).toBe(trigger)
    expect(page.getByLabelText('Search repositories').element()).toBe(search)
    await expect
      .element(page.getByRole('option', {name: /copilot-agent-runtime/}))
      .toHaveAttribute('aria-selected', 'true')
  })
})
