import {useEffect} from 'react'
import {act, cleanup, render} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {SelectPanelPlaygroundRecording, type PlaygroundRecordingPreviewProps} from './SelectPanelPlaygroundRecording'
import {PLAYGROUND_RECORDING_COUNTDOWN, PLAYGROUND_RECORDING_DURATION} from './playgroundRecording'

function Preview({config, resetKey, onReady}: PlaygroundRecordingPreviewProps) {
  useEffect(onReady, [onReady])
  return <output aria-label="Preview clock">{JSON.stringify({elapsedMs: config.elapsedMs, resetKey})}</output>
}

function recording() {
  return <SelectPanelPlaygroundRecording renderPreview={props => <Preview {...props} />} />
}

function previewTime() {
  return JSON.parse(page.getByLabelText('Preview clock').element().textContent!) as {
    elapsedMs: number
    resetKey: number
  }
}

beforeEach(() => {
  vi.useFakeTimers({toFake: ['setInterval', 'clearInterval', 'performance']})
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Playground recording controls', () => {
  it('waits for the preview and never autoplays on mount', async () => {
    const {rerender} = render(
      <SelectPanelPlaygroundRecording renderPreview={() => <span>Preview still loading</span>} />,
    )
    await expect.element(page.getByRole('button', {name: 'Play tour'})).toBeDisabled()
    await expect.element(page.getByRole('button', {name: 'Record mode'})).toBeDisabled()
    await act(() => vi.advanceTimersByTimeAsync(30_000))
    expect(vi.getTimerCount()).toBe(0)
    rerender(recording())
    await expect.element(page.getByRole('button', {name: 'Play tour'})).toBeEnabled()
    expect(previewTime()).toEqual({elapsedMs: 0, resetKey: 0})
    expect(vi.getTimerCount()).toBe(0)
  })

  it('updates actual controls and preview time together, stops at 25 seconds, and replays from zero', async () => {
    const {container} = render(recording())
    const preview = page.getByLabelText('Preview clock').element()
    expect(container.querySelector('[data-view]')).toHaveProperty('inert', true)
    await userEvent.click(page.getByRole('button', {name: 'Play tour'}))
    expect(previewTime()).toEqual({elapsedMs: 0, resetKey: 1})
    await act(() => vi.advanceTimersByTimeAsync(1_900))
    expect(page.getByLabelText('Descriptions').element()).not.toBeChecked()
    expect(page.getByText('Show anatomy', {exact: true}).element().closest('button')).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(page.getByLabelText('Descriptions').element()).toBeChecked()
    expect(previewTime().elapsedMs).toBe(2_000)
    expect(container.querySelector('[data-recording-active="true"]')).toHaveTextContent('Grouped options')
    await act(() => vi.advanceTimersByTimeAsync(6_000))
    expect(page.getByLabelText('Multiple selection').element()).toBeChecked()
    expect(page.getByLabelText('Apply changes').element()).toHaveValue('submit')
    await act(() => vi.advanceTimersByTimeAsync(3_000))
    expect(page.getByLabelText('Appearance').element()).toHaveValue('2')
    await act(() => vi.advanceTimersByTimeAsync(9_000))
    expect(container.querySelector('[data-mobile="true"]')).toContainElement(preview)
    await act(() => vi.advanceTimersByTimeAsync(3_000))
    expect(container.querySelector('pre')).toHaveAccessibleName('React example')
    expect(container.querySelector('pre')).toHaveTextContent('selectionMode="multiple"')
    await act(() => vi.advanceTimersByTimeAsync(1_900))
    expect(page.getByRole('button', {name: 'Pause'}).element()).toBeEnabled()
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(page.getByRole('button', {name: 'Replay'}).element()).toBeEnabled()
    expect(previewTime().elapsedMs).toBe(PLAYGROUND_RECORDING_DURATION)
    expect(vi.getTimerCount()).toBe(0)
    await userEvent.click(page.getByRole('button', {name: 'Replay'}))
    expect(previewTime()).toEqual({elapsedMs: 0, resetKey: 2})
    expect(page.getByLabelText('Preview clock').element()).toBe(preview)
    expect(page.getByLabelText('Descriptions').element()).not.toBeChecked()
  })

  it('includes an exact three-second countdown, hides playback chrome, and resumes after Escape', async () => {
    render(recording())
    await userEvent.click(page.getByRole('button', {name: 'Record mode'}))
    expect(page.getByRole('status', {name: 'Recording countdown'}).element()).toHaveTextContent('3')
    expect(page.getByLabelText('Playground recording controls').element()).not.toBeVisible()
    await act(() => vi.advanceTimersByTimeAsync(2_900))
    expect(page.getByRole('status', {name: 'Recording countdown'}).element()).toHaveTextContent('1')
    expect(previewTime().elapsedMs).toBe(0)
    await act(() => vi.advanceTimersByTimeAsync(100))
    await expect.element(page.getByRole('status', {name: 'Recording countdown'})).not.toBeInTheDocument()
    expect(previewTime().elapsedMs).toBe(0)
    await act(() => vi.advanceTimersByTimeAsync(800))
    expect(previewTime().elapsedMs).toBe(800)
    await userEvent.keyboard('{Escape}')
    expect(page.getByRole('button', {name: 'Resume'}).element()).toBeVisible()
    const paused = previewTime()
    await act(() => vi.advanceTimersByTimeAsync(2_000))
    expect(previewTime()).toEqual(paused)
    expect(vi.getTimerCount()).toBe(0)
    await userEvent.click(page.getByRole('button', {name: 'Resume'}))
    await act(() => vi.advanceTimersByTimeAsync(200))
    expect(previewTime().elapsedMs).toBe(1_000)
    await act(() => vi.advanceTimersByTimeAsync(PLAYGROUND_RECORDING_DURATION))
    expect(page.getByRole('button', {name: 'Replay'}).element()).toBeVisible()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('pauses and shows controls when the tab is hidden, and cleans up its clock on unmount', async () => {
    const {unmount} = render(recording())
    await userEvent.click(page.getByRole('button', {name: 'Record mode'}))
    await act(() => vi.advanceTimersByTimeAsync(PLAYGROUND_RECORDING_COUNTDOWN + 500))
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    act(() => document.dispatchEvent(new Event('visibilitychange')))
    expect(page.getByRole('button', {name: 'Resume'}).element()).toBeVisible()
    const paused = previewTime()
    await act(() => vi.advanceTimersByTimeAsync(1_000))
    expect(previewTime()).toEqual(paused)
    expect(vi.getTimerCount()).toBe(0)
    vi.restoreAllMocks()
    await userEvent.click(page.getByRole('button', {name: 'Resume'}))
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
    act(() => document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})))
  })
})
