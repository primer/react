import {act, cleanup, fireEvent, render} from '@testing-library/react'
import {useEffect} from 'react'
import {afterEach, beforeEach, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import {SelectPanelFilm} from './SelectPanelFilm'
import classes from './SelectPanelFilm.module.css'
import {filmDuration, filmTiming} from './filmTimeline'

vi.mock('./SelectPanelFilmSource', () => ({
  SelectPanelFilmSource: ({
    onReady,
    onFocus,
  }: {
    onReady: (anchor: {x: number; y: number}) => void
    onFocus: (center: {x: number; y: number}) => void
  }) => {
    useEffect(() => {
      onReady({x: 1120, y: 375})
      onFocus({x: 940, y: 568})
    }, [onReady, onFocus])
    return (
      <>
        <span data-film-source-anchor style={{position: 'absolute', left: 1120, top: 375}} />
        <span data-film-source-panel style={{position: 'absolute', left: 780, top: 326, width: 320, height: 484}} />
      </>
    )
  },
}))

beforeEach(() => {
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout', 'clearTimeout'],
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

it('preserves early close-ups and keeps later framing fixed except for the theme close-up', () => {
  const {container} = render(<SelectPanelFilm />)
  const position = page.getByRole('slider', {name: 'Scene position'})
  const anchor = container.querySelector('[data-film-source-anchor]')!
  const stage = container.querySelector(`.${classes.Stage}`)!
  const point = () => {
    const bounds = stage.getBoundingClientRect()
    const marker = anchor.getBoundingClientRect()
    const scale = bounds.width / 1440
    return {x: (marker.x - bounds.x) / scale, y: (marker.y - bounds.y) / scale}
  }
  const opening = point()
  const expectDirectMove = (start: number, end: number) => {
    fireEvent.change(position.element(), {target: {value: String(end)}})
    const target = point()
    fireEvent.change(position.element(), {target: {value: String(start)}})
    let distance = Math.hypot(point().x - target.x, point().y - target.y)
    for (let step = 1; step <= 16; step++) {
      fireEvent.change(position.element(), {target: {value: String(start + ((end - start) * step) / 16)}})
      const current = point()
      const nextDistance = Math.hypot(current.x - target.x, current.y - target.y)
      expect(nextDistance).toBeLessThanOrEqual(distance + 0.01)
      distance = nextDistance
    }
  }
  expectDirectMove(480, 1_000)
  expectDirectMove(1_280, 1_700)
  fireEvent.change(position.element(), {target: {value: '1000'}})
  expect(point().x).toBeCloseTo(720, 0)
  expect(point().y).toBeCloseTo(405, 0)
  for (const time of [1_700, filmTiming.split - 1]) {
    fireEvent.change(position.element(), {target: {value: String(time)}})
    const bounds = stage.getBoundingClientRect()
    const panel = container.querySelector('[data-film-source-panel]')!.getBoundingClientRect()
    const scale = bounds.width / 1440
    expect((panel.top - bounds.top) / scale).toBeGreaterThan(80)
    expect((bounds.bottom - panel.bottom) / scale).toBeGreaterThan(80)
    expect(panel.left).toBeGreaterThan(bounds.left)
    expect(panel.right).toBeLessThan(bounds.right)
    expect(panel.width / scale).toBeCloseTo(320 * 1.2, 0)
  }
  fireEvent.change(position.element(), {target: {value: '5000'}})
  expect(point().x).toBeCloseTo(1120, 0)
  expect(point().y).toBeCloseTo(375, 0)
  for (const time of [
    filmTiming.build,
    filmTiming.build + 300,
    filmTiming.groups + 400,
    filmTiming.search + 400,
    filmTiming.multiple + 1_500,
    filmTiming.footer + 1_500,
    filmTiming.statuses + 700,
    filmTiming.mobile + 150,
    filmTiming.platform + 200,
    filmTiming.platform + 3_200,
    filmTiming.closing + 100,
  ]) {
    fireEvent.change(position.element(), {target: {value: String(time)}})
    expect(point().x).toBeCloseTo(1120, 0)
    expect(point().y).toBeCloseTo(375, 0)
  }
  const lens = container.querySelector(`.${classes.Lens}`)!
  expect(new DOMMatrix(getComputedStyle(lens).transform).a).toBe(1)
  fireEvent.change(position.element(), {target: {value: '0'}})
  expect(point()).toEqual(opening)
})

it('keeps the clock at zero when the first animation timestamp predates the effect', async () => {
  const frames: FrameRequestCallback[] = []
  const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.push(callback)
    return frames.length
  })
  try {
    render(<SelectPanelFilm />)
    await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
    const position = page.getByRole('slider', {name: 'Scene position'})
    act(() => frames[0](performance.now() - 1))
    expect(position.element()).toHaveValue('0')
    act(() => frames[1](performance.now() + 20))
    expect(position.element()).toHaveValue('20')
  } finally {
    request.mockRestore()
  }
})

it('plays, pauses, finishes, and replays the scene', async () => {
  render(<SelectPanelFilm />)
  const position = page.getByRole('slider', {name: 'Scene position'})
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  await act(() => vi.advanceTimersByTimeAsync(4_000))
  expect(Number(position.element().getAttribute('value'))).toBeGreaterThan(3_900)
  await userEvent.click(page.getByRole('button', {name: 'Pause scene', exact: true}))
  const paused = position.element().getAttribute('value')
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  expect(position.element()).toHaveValue(paused)
  fireEvent.change(position.element(), {target: {value: String(filmDuration - 1_000)}})
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  await act(() => vi.advanceTimersByTimeAsync(1_200))
  expect(position.element()).toHaveValue(String(filmDuration))
  expect(position.element()).toHaveAttribute('aria-valuetext', '1:16')
  await userEvent.click(page.getByRole('button', {name: 'Replay scene', exact: true}))
  expect(position.element()).toHaveValue('0')
  await userEvent.click(page.getByRole('button', {name: 'Restart', exact: true}))
  expect(position.element()).toHaveValue('0')
  await expect.element(page.getByRole('button', {name: 'Play scene', exact: true})).toBeVisible()
})

it('scrubs and pauses without adding narrative text to the film', async () => {
  const {container} = render(<SelectPanelFilm />)
  const position = page.getByRole('slider', {name: 'Scene position'})
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  fireEvent.change(position.element(), {target: {value: '5000'}})
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  expect(position.element()).toHaveValue('5000')
  expect(container.querySelector('h1, h2, p')).toBeNull()
  fireEvent.change(position.element(), {target: {value: '0'}})
  expect(position.element()).toHaveValue('0')
})

it('jumps to scenes using the bottom buttons and pauses playback', async () => {
  render(<SelectPanelFilm />)
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  const scenes = page.getByRole('navigation', {name: 'Film scenes'})
  expect(scenes.getByRole('button', {name: 'Make it yours'}).query()).toBeNull()
  const platform = scenes.getByRole('button', {name: 'Platform and performance'})
  await userEvent.click(platform)
  expect(platform.element()).toHaveAttribute('aria-current', 'step')
  const position = page.getByRole('slider', {name: 'Scene position'})
  expect(position.element()).toHaveValue(String(filmTiming.platform))
  const team = page.getByRole('navigation', {name: 'Film scenes'}).getByRole('button', {name: 'Back to the team'})
  await userEvent.click(team)
  expect(position.element()).toHaveValue(String(filmTiming.teamReturn))
  expect(team.element()).toHaveAttribute('aria-current', 'step')
  await userEvent.click(platform)
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  expect(position.element()).toHaveValue(String(filmTiming.platform))
  for (const name of ['1. Under the hood', '2. Less to reinvent', '3. Built to last'])
    expect(scenes.getByRole('button', {name}).query()).toBeNull()
  await expect.element(page.getByRole('button', {name: 'Play scene', exact: true})).toBeVisible()
})

it('autoplays across scene boundaries by default and updates the active scene', async () => {
  render(<SelectPanelFilm />)
  expect(page.getByRole('button', {name: 'Autoplay next scene'}).element()).toHaveAttribute('aria-pressed', 'true')
  const position = page.getByRole('slider', {name: 'Scene position'})
  fireEvent.change(position.element(), {target: {value: '7900'}})
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  await act(() => vi.advanceTimersByTimeAsync(300))
  expect(Number(position.element().getAttribute('value'))).toBeGreaterThan(8_000)
  expect(page.getByRole('button', {name: 'The conversation'}).element()).toHaveAttribute('aria-current', 'step')
  await expect.element(page.getByRole('button', {name: 'Pause scene', exact: true})).toBeVisible()
})

it('holds each scene end with autoplay off and continues to the next scene on Play', async () => {
  render(<SelectPanelFilm />)
  await userEvent.click(page.getByRole('button', {name: 'Autoplay next scene'}))
  const position = page.getByRole('slider', {name: 'Scene position'})
  fireEvent.change(position.element(), {target: {value: '7900'}})
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  await act(() => vi.advanceTimersByTimeAsync(500))
  expect(position.element()).toHaveValue('7990')
  expect(page.getByRole('button', {name: 'Labels → building blocks'}).element()).toHaveAttribute('aria-current', 'step')
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  expect(position.element()).toHaveValue('8000')
  await act(() => vi.advanceTimersByTimeAsync(11_000))
  expect(position.element()).toHaveValue(String(filmTiming.draft - 10))
  expect(page.getByRole('button', {name: 'The conversation'}).element()).toHaveAttribute('aria-current', 'step')
  await expect.element(page.getByRole('button', {name: 'Play scene', exact: true})).toBeVisible()

  await userEvent.click(page.getByRole('button', {name: 'Autoplay next scene'}))
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  await act(() => vi.advanceTimersByTimeAsync(300))
  expect(Number(position.element().getAttribute('value'))).toBeGreaterThan(filmTiming.draft)

  await userEvent.click(page.getByRole('button', {name: 'SelectPanel', exact: true}))
  await userEvent.click(page.getByRole('button', {name: 'Autoplay next scene'}))
  await userEvent.click(page.getByRole('button', {name: 'Play scene', exact: true}))
  await act(() => vi.advanceTimersByTimeAsync(3_200))
  expect(position.element()).toHaveValue(String(filmDuration))
  await userEvent.click(page.getByRole('button', {name: 'Replay scene', exact: true}))
  expect(position.element()).toHaveValue('0')
})

it('counts down before presentation and restores paused controls on Escape', async () => {
  render(<SelectPanelFilm />)
  const slider = page.getByRole('slider', {name: 'Scene position'}).element()
  await userEvent.click(page.getByRole('button', {name: 'Present scene', exact: true}))
  await expect.element(page.getByRole('status')).toHaveTextContent('3')
  expect(slider).not.toBeVisible()
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  expect(page.getByRole('status').element()).toHaveTextContent('2')
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  await act(() => vi.advanceTimersByTimeAsync(999))
  expect(page.getByRole('status').element()).toHaveTextContent('1')
  expect(slider).toHaveValue('0')
  await act(() => vi.advanceTimersByTimeAsync(1))
  expect(page.getByRole('status').query()).toBeNull()
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  fireEvent.keyDown(document, {key: 'Escape'})
  await expect.element(page.getByRole('button', {name: 'Play scene', exact: true})).toBeVisible()
  const position = page.getByRole('slider', {name: 'Scene position'})
  const paused = position.element().getAttribute('value')
  expect(Number(paused)).toBeGreaterThan(0)
  await act(() => vi.advanceTimersByTimeAsync(1_000))
  expect(position.element()).toHaveValue(paused)
})
