import {useEffect} from 'react'
import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent as browserUserEvent} from 'vitest/browser'
import {SelectPanelShowcase, type ShowcasePreviewProps} from './SelectPanelShowcase'
import {SHOWCASE_DURATION} from './showcase'
import {
  getShowcaseDuration,
  SHOWCASE_INTRO_DURATION,
  SHOWCASE_NEXT_DURATION,
  type ShowcaseLayout,
} from './showcasePlayback'
import {MatchMediaContext} from '../../hooks/MatchMediaContext'

function Preview({config, onReady}: ShowcasePreviewProps) {
  useEffect(onReady, [onReady])
  return <output aria-label="Film time">{config.elapsedMs}</output>
}

function renderFilm(defaultLayout: ShowcaseLayout = 'split') {
  return render(<SelectPanelShowcase defaultLayout={defaultLayout} renderPreview={props => <Preview {...props} />} />)
}

beforeEach(() => {
  vi.useFakeTimers({toFake: ['setInterval', 'clearInterval', 'performance']})
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('SelectPanel showcase playback', () => {
  it('uses heading-only narration on text slides while retaining the candidate details', async () => {
    renderFilm('slideshow')
    for (const chapter of [
      'Start',
      'Compose',
      'Extend',
      'Customize',
      'Adapt',
      'Platform & performance',
      "What's next?",
      'Primer',
    ]) {
      await browserUserEvent.click(page.getByRole('button', {name: chapter, exact: true}))
      const heading = page.getByRole('heading', {level: 1}).element()
      expect(heading.parentElement!.querySelector('p')).toBeNull()
      expect(heading.closest('section')!.querySelector(':scope > p')).toBeNull()
      if (chapter === "What's next?") {
        expect(
          page.getByRole('list', {name: 'Candidates for composition'}).element().querySelectorAll('p'),
        ).toHaveLength(5)
      }
    }
  })

  it('keeps demo captions keyboard-only and reserves their space when there is no key cue', async () => {
    renderFilm('split')
    await browserUserEvent.click(page.getByRole('button', {name: 'Compose', exact: true}))
    const cue = page.getByRole('group', {name: 'Demonstrated keyboard input'})
    expect(cue.element()).toHaveAttribute('data-key-cue', 'ArrowDown')
    expect(cue.element().children).toHaveLength(1)
    expect(cue.element().querySelector('kbd')).not.toBeNull()
    expect(page.getByRole('main').element()).not.toHaveTextContent('A collection built on ActionList')
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(1_500))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    const demo = page.getByRole('region', {name: 'Scripted product demonstration'}).element()
    const caption = demo.lastElementChild!
    expect(caption).toBeEmptyDOMElement()
    expect(caption.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    expect(page.getByRole('main').element()).not.toHaveTextContent('A collection built on ActionList')
  })

  it.each(['slideshow', 'split'] as const)(
    'presents the next candidates with synchronized animation in %s',
    async layout => {
      renderFilm(layout)
      const preview = screen.getByLabelText('Film time')
      await browserUserEvent.click(page.getByRole('button', {name: "What's next?", exact: true}))
      const candidates = screen.getByRole('list', {name: 'Candidates for composition'})
      const cards = Array.from(candidates.children)
      const film = candidates.closest('section')!.parentElement!
      expect(cards.map(card => card.querySelector('h2')?.textContent)).toEqual([
        'FilteredActionList',
        'Autocomplete',
        'Dialog',
        'TextInput',
        'Pagination',
      ])
      expect(candidates).not.toHaveTextContent('SelectPanel')
      expect(screen.getByRole('heading', {name: 'Where could composition go next?'})).toBeVisible()
      expect(preview).toHaveTextContent(String(SHOWCASE_DURATION))
      expect(preview.closest('section')).toHaveAttribute('hidden')
      expect(screen.getByRole('button', {name: "What's next?"})).toHaveAttribute('aria-current', 'step')
      expect(vi.getTimerCount()).toBe(0)
      expect(cards.every(card => getComputedStyle(card).opacity === '1')).toBe(true)
      expect(cards.every(card => getComputedStyle(card).backgroundColor === 'rgba(0, 0, 0, 0)')).toBe(true)
      const colors = new Map<string, string>()
      for (const label of candidates.querySelectorAll('[data-component="Label"]')) {
        const name = label.textContent!
        const color = getComputedStyle(label).color
        if (colors.has(name)) expect(color).toBe(colors.get(name))
        else expect([...colors.values()]).not.toContain(color)
        colors.set(name, color)
      }
      expect(colors.size).toBe(14)
      await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
      await act(() => vi.advanceTimersByTimeAsync(800))
      await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
      const firstOpacity = Number(getComputedStyle(cards[0]).opacity)
      expect(firstOpacity).toBeGreaterThan(0)
      expect(firstOpacity).toBeLessThan(1)
      expect(getComputedStyle(cards[4]).opacity).toBe('0')
      const firstTransform = getComputedStyle(cards[0]).transform
      await act(() => vi.advanceTimersByTimeAsync(1_000))
      expect(Number(getComputedStyle(cards[0]).opacity)).toBe(firstOpacity)
      expect(getComputedStyle(cards[0]).transform).toBe(firstTransform)
      expect(film.getAnimations({subtree: true}).every(animation => animation.playState === 'paused')).toBe(true)
      await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
      await act(() => vi.advanceTimersByTimeAsync(1_200))
      await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
      expect(cards.every(card => getComputedStyle(card).opacity === '1')).toBe(true)
      await browserUserEvent.click(
        page.getByRole('button', {name: layout === 'slideshow' ? 'Split view' : 'Slideshow', exact: true}),
      )
      expect(screen.getByRole('list', {name: 'Candidates for composition'})).toBe(candidates)
      expect(screen.getByLabelText('Film time')).toBe(preview)
      expect(film).toHaveAttribute('data-phase', 'card')
      await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
      await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_NEXT_DURATION - 2_000))
      expect(screen.getByRole('heading', {name: 'More composable. Still Primer.'})).toBeInTheDocument()
      expect(screen.queryByRole('list', {name: 'Candidates for composition'})).not.toBeInTheDocument()
      expect(screen.getByLabelText('Film time').closest('section')).toHaveAttribute('hidden')
      await act(() => vi.advanceTimersByTimeAsync(getShowcaseDuration(layout)))
      expect(screen.getByRole('button', {name: 'Replay'})).toBeVisible()
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      expect(vi.getTimerCount()).toBe(0)
    },
  )

  it('restores a fully readable next slide when reduced motion changes during the reveal', async () => {
    const fixture = (reducedMotion: boolean) => (
      <MatchMediaContext.Provider value={{'(prefers-reduced-motion: reduce)': reducedMotion}}>
        <SelectPanelShowcase renderPreview={props => <Preview {...props} />} />
      </MatchMediaContext.Provider>
    )
    const {rerender} = render(fixture(false))
    await browserUserEvent.click(page.getByRole('button', {name: "What's next?", exact: true}))
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(800))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    const candidates = screen.getByRole('list', {name: 'Candidates for composition'})
    const cards = Array.from(candidates.children)
    const film = candidates.closest('section')!.parentElement!
    expect(getComputedStyle(cards[4]).opacity).toBe('0')
    rerender(fixture(true))
    expect(cards.every(card => getComputedStyle(card).opacity === '1')).toBe(true)
    expect(cards.every(card => getComputedStyle(card).transform === 'none')).toBe(true)
    expect(film.getAnimations({subtree: true})).toHaveLength(0)
    rerender(fixture(false))
    expect(getComputedStyle(cards[4]).opacity).toBe('0')
    expect(film.getAnimations({subtree: true}).every(animation => animation.playState === 'paused')).toBe(true)
  })

  it('keeps the final slide visible when recording finishes and restores controls on Escape', async () => {
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: 'Record mode', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(3_000 + getShowcaseDuration('slideshow')))
    const heading = screen.getByRole('heading', {name: 'More composable. Still Primer.'})
    expect(heading).toBeVisible()
    expect(getComputedStyle(heading.closest('section')!).opacity).toBe('1')
    expect(screen.getByRole('main')).toHaveAttribute('data-recording', 'true')
    expect(screen.queryByRole('button', {name: 'Replay'})).not.toBeInTheDocument()
    expect(vi.getTimerCount()).toBe(0)
    await browserUserEvent.keyboard('{Escape}')
    expect(screen.getByRole('main')).toHaveAttribute('data-recording', 'false')
    expect(screen.getByRole('button', {name: 'Replay'})).toBeVisible()
  })

  it.each([400, 1000, 1600])('keeps candidate cards readable within a %s px viewport', async width => {
    await page.viewport(width, 1200)
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: "What's next?", exact: true}))
    const candidates = screen.getByRole('list', {name: 'Candidates for composition'})
    for (const card of Array.from(candidates.children)) {
      const bounds = card.getBoundingClientRect()
      expect(bounds.left).toBeGreaterThanOrEqual(0)
      expect(bounds.right).toBeLessThanOrEqual(width)
      expect(card.scrollWidth).toBeLessThanOrEqual(card.clientWidth)
    }
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width)
  })

  it.each(['slideshow', 'split'] as const)('starts without a masthead in %s view', layout => {
    renderFilm(layout)
    expect(screen.queryByText('Same Primer. More possibilities.')).not.toBeInTheDocument()
    expect(screen.queryByText('SelectPanel / A composable future')).not.toBeInTheDocument()
    expect(screen.getByRole('main').querySelector('header')).toBeNull()
    expect(screen.queryByText('The flexibility is in the composition.')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Style'})).not.toBeInTheDocument()
    const chapters = page.getByRole('navigation', {name: 'Showcase chapters'}).element()
    expect(chapters.lastElementChild).toHaveTextContent('Primer')
  })

  it.each([400, 1000, 1600])(
    'opens with full-width text instead of a sidebar in the default layout at %s px',
    async width => {
      await page.viewport(width, 1000)
      render(<SelectPanelShowcase renderPreview={props => <Preview {...props} />} />)
      expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'slideshow')
      expect(screen.queryByText('Start', {selector: 'p'})).not.toBeInTheDocument()
      expect(screen.queryByRole('group', {name: 'Building blocks in this scene'})).not.toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'Slideshow'})).toHaveAttribute('aria-pressed', 'true')
      const heading = screen.getByRole('heading', {name: 'Start with familiar pieces.'})
      expect(Number.parseFloat(getComputedStyle(heading).fontSize)).toBeLessThanOrEqual(60)
      if (width === 1600) expect(getComputedStyle(heading).fontSize).toBe('60px')
      const narrative = heading.closest('section')!
      const film = narrative.parentElement!
      expect(film).toHaveAttribute('data-phase', 'intro')
      expect(narrative.getBoundingClientRect().width).toBeGreaterThanOrEqual(
        Math.min(1120, film.getBoundingClientRect().width) - 1,
      )
      expect(narrative.getBoundingClientRect().right).toBeLessThanOrEqual(width)
      expect(screen.queryByRole('region', {name: 'Scripted product demonstration'})).not.toBeInTheDocument()
      expect(screen.getByLabelText('Film time').closest('section')).not.toBeVisible()
    },
  )

  it('shows the full demo after the introduction without remounting or advancing its script', async () => {
    renderFilm('slideshow')
    const preview = screen.getByLabelText('Film time')
    const screenRegion = preview.closest('section')!
    await browserUserEvent.click(page.getByRole('button', {name: 'Play demo', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_INTRO_DURATION - 100))
    expect(screenRegion).not.toBeVisible()
    expect(preview).toHaveTextContent(/^0$/)
    await act(() => vi.advanceTimersByTimeAsync(100))
    expect(screenRegion).not.toHaveAttribute('hidden')
    expect(screen.getByLabelText('Film time')).toBe(preview)
    expect(preview).toHaveTextContent(/^0$/)
    expect(screen.queryByRole('heading', {name: 'Start with familiar pieces.'})).not.toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(1_400))
    expect(preview).toHaveTextContent(/^1400$/)
    expect(screen.getByRole('group', {name: 'Demonstrated keyboard input'})).toBeVisible()
  })

  it('can immediately revert to split view and back while preserving the demo position and pausing', async () => {
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: 'Play demo', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_INTRO_DURATION + 4_000))
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^4000$/)
    await browserUserEvent.click(page.getByRole('button', {name: 'Split view', exact: true}))
    expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'split')
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^4000$/)
    await expect.element(page.getByRole('heading', {name: 'Start with familiar pieces.'})).toBeVisible()
    expect(screen.getByRole('region', {name: 'Scripted product demonstration'})).not.toHaveAttribute('hidden')
    expect(page.getByRole('button', {name: 'Resume', exact: true}).element()).toBeVisible()
    expect(vi.getTimerCount()).toBe(0)
    await browserUserEvent.click(page.getByRole('button', {name: 'Slideshow', exact: true}))
    expect(screen.getByRole('main')).toHaveAttribute('data-layout', 'slideshow')
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^4000$/)
    expect(screen.getByRole('region', {name: 'Scripted product demonstration'})).toBeVisible()
    expect(screen.queryByRole('heading', {name: 'Start with familiar pieces.'})).not.toBeInTheDocument()
  })

  it('seeks to an introduction, then shows the entire mobile demo before finishing and replaying', async () => {
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: 'Adapt', exact: true}))
    await expect.element(page.getByRole('heading', {name: 'Change the container.'})).toBeVisible()
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^38000$/)
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_INTRO_DURATION))
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^38000$/)
    expect(screen.getByRole('region', {name: 'Scripted product demonstration'})).not.toHaveAttribute('hidden')
    await act(() => vi.advanceTimersByTimeAsync(1_500))
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^39500$/)
    await act(() => vi.advanceTimersByTimeAsync(23_000))
    expect(page.getByRole('button', {name: 'Replay', exact: true}).element()).toBeVisible()
    await expect.element(page.getByRole('heading', {name: 'More composable. Still Primer.'})).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    await browserUserEvent.click(page.getByRole('button', {name: 'Replay', exact: true}))
    await expect.element(page.getByRole('heading', {name: 'Start with familiar pieces.'})).toBeVisible()
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^0$/)
    expect(page.getByRole('button', {name: 'Pause', exact: true}).element()).toBeVisible()
  })

  it('records slideshow intros after the countdown and restores the layout controls on Escape', async () => {
    renderFilm('slideshow')
    const splitButton = screen.getByRole('button', {name: 'Split view'})
    await browserUserEvent.click(page.getByRole('button', {name: 'Record mode', exact: true}))
    expect(screen.getByRole('status', {name: 'Recording countdown'})).toHaveTextContent('3')
    expect(splitButton).not.toBeVisible()
    await act(() => vi.advanceTimersByTimeAsync(3_000))
    expect(screen.getByRole('heading', {name: 'Start with familiar pieces.'})).toBeInTheDocument()
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^0$/)
    expect(screen.queryByRole('region', {name: 'Scripted product demonstration'})).not.toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_INTRO_DURATION))
    expect(screen.getByRole('region', {name: 'Scripted product demonstration'})).not.toHaveAttribute('hidden')
    await browserUserEvent.keyboard('{Escape}')
    expect(screen.getByRole('main')).toHaveAttribute('data-recording', 'false')
    expect(screen.getByRole('button', {name: 'Slideshow'})).toHaveAttribute('aria-pressed', 'true')
    expect(page.getByRole('button', {name: 'Resume', exact: true}).element()).toBeVisible()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('types the heading without layout shifts or partial accessible names, and freezes all effects when paused', async () => {
    renderFilm('slideshow')
    const heading = screen.getByRole('heading', {name: 'Start with familiar pieces.'})
    const height = heading.getBoundingClientRect().height
    const characters = heading.querySelectorAll('span[style]')
    await browserUserEvent.click(page.getByRole('button', {name: 'Play demo', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(400))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    expect(heading).toHaveAccessibleName('Start with familiar pieces.')
    expect(heading.getBoundingClientRect().height).toBe(height)
    expect(getComputedStyle(characters[0]).opacity).toBe('1')
    expect(getComputedStyle(characters[characters.length - 1]).opacity).toBe('0')
    const film = heading.closest('section')!.parentElement!
    const animations = film.getAnimations({subtree: true})
    expect(animations.length).toBeGreaterThan(0)
    expect(animations.every(animation => animation.playState === 'paused' && animation.currentTime === 400)).toBe(true)
    await act(() => vi.advanceTimersByTimeAsync(1_000))
    expect(animations.every(animation => animation.currentTime === 400)).toBe(true)
    expect(getComputedStyle(characters[characters.length - 1]).opacity).toBe('0')
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(400))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    expect(Array.from(characters).every(character => getComputedStyle(character).opacity === '1')).toBe(true)
    await browserUserEvent.click(page.getByRole('button', {name: 'Compose', exact: true}))
    expect(screen.getByRole('heading', {name: 'Choose the parts you need.'})).toHaveTextContent(
      'Choose the parts you need.',
    )
    expect(film.getAnimations({subtree: true})).toHaveLength(0)
  })

  it('fades the title card out and the demo in without advancing the product during the introduction', async () => {
    renderFilm('slideshow')
    const narrative = screen.getByRole('heading', {name: 'Start with familiar pieces.'}).closest('section')!
    const demonstration = screen.getByLabelText('Film time').closest('section')!
    await browserUserEvent.click(page.getByRole('button', {name: 'Play demo', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_INTRO_DURATION - 100))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    const exitOpacity = Number(getComputedStyle(narrative).opacity)
    expect(exitOpacity).toBeGreaterThan(0)
    expect(exitOpacity).toBeLessThan(1)
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^0$/)
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(200))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    expect(narrative).toHaveAttribute('hidden')
    expect(demonstration).not.toHaveAttribute('hidden')
    const entranceOpacity = Number(getComputedStyle(demonstration).opacity)
    expect(entranceOpacity).toBeGreaterThan(0)
    expect(entranceOpacity).toBeLessThan(1)
    expect(screen.getByLabelText('Film time')).toHaveTextContent(/^100$/)
  })

  it('disables motion immediately when the preference changes and restores the paused animation position', async () => {
    const fixture = (reducedMotion: boolean) => (
      <MatchMediaContext.Provider value={{'(prefers-reduced-motion: reduce)': reducedMotion}}>
        <SelectPanelShowcase defaultLayout="slideshow" renderPreview={props => <Preview {...props} />} />
      </MatchMediaContext.Provider>
    )
    const {rerender} = render(fixture(false))
    const heading = screen.getByRole('heading', {name: 'Start with familiar pieces.'})
    const characters = heading.querySelectorAll('span[style]')
    const film = heading.closest('section')!.parentElement!
    await browserUserEvent.click(page.getByRole('button', {name: 'Play demo', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(400))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    expect(getComputedStyle(characters[characters.length - 1]).opacity).toBe('0')
    rerender(fixture(true))
    expect(film).toHaveAttribute('data-motion', 'false')
    expect(film.getAnimations({subtree: true})).toHaveLength(0)
    expect(Array.from(characters).every(character => getComputedStyle(character).opacity === '1')).toBe(true)
    rerender(fixture(false))
    expect(film).toHaveAttribute('data-motion', 'true')
    expect(getComputedStyle(characters[characters.length - 1]).opacity).toBe('0')
    expect(film.getAnimations({subtree: true}).every(animation => animation.playState === 'paused')).toBe(true)
    rerender(fixture(true))
    await browserUserEvent.click(page.getByRole('button', {name: 'Platform & performance', exact: true}))
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(800))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    const capabilities = screen.getByRole('list', {name: 'Platform and performance capabilities'})
    expect(Array.from(capabilities.children).every(capability => getComputedStyle(capability).opacity === '1')).toBe(
      true,
    )
    expect(
      Array.from(capabilities.children).every(capability => getComputedStyle(capability).transform === 'none'),
    ).toBe(true)
    expect(film.getAnimations({subtree: true})).toHaveLength(0)
  })

  it('rotates all five capabilities through the center, pauses in place, and resets on seeking', async () => {
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: 'Platform & performance', exact: true}))
    const heading = screen.getByRole('heading', {name: 'Platform & performance.'})
    const film = heading.closest('section')!.parentElement!
    const capabilities = screen.getByRole('list', {name: 'Platform and performance capabilities'})
    const window = capabilities.parentElement!
    const labels = [
      'Popover API',
      'CSS Anchor Positioning',
      'Invoker Commands API',
      'Native <dialog> element',
      'Virtualization',
    ]
    expect(capabilities.children).toHaveLength(labels.length)
    expect(capabilities).toHaveTextContent('An optional TanStack Virtual collection for large datasets')
    expect(heading.closest('section')!.querySelector('p')).toBeNull()
    expect(screen.queryByRole('group', {name: 'Building blocks in this scene'})).not.toBeInTheDocument()
    expect(screen.getByLabelText('Film time').closest('section')).toHaveAttribute('hidden')
    for (const [index, label] of labels.entries()) {
      if (index > 0) {
        await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
        await act(() => vi.advanceTimersByTimeAsync(1_200))
        await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
      }
      const active = capabilities.querySelector('[data-active="true"]')!
      expect(capabilities.querySelectorAll('[data-active="true"]')).toHaveLength(1)
      expect(active).toHaveTextContent(label)
      const bounds = active.getBoundingClientRect()
      const viewport = window.getBoundingClientRect()
      expect(Math.abs(bounds.y + bounds.height / 2 - (viewport.y + viewport.height / 2))).toBeLessThan(1)
      expect(getComputedStyle(active).color).not.toBe(
        getComputedStyle(capabilities.children[(index + 1) % labels.length]).color,
      )
      const rotation = getComputedStyle(capabilities).transform
      await act(() => vi.advanceTimersByTimeAsync(500))
      expect(getComputedStyle(capabilities).transform).toBe(rotation)
    }
    expect(film).toHaveAttribute('data-phase', 'card')
    expect(screen.getByLabelText('Film time').closest('section')).toHaveAttribute('hidden')
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(1_200))
    expect(film).toHaveAttribute('data-scene', 'next')
    expect(screen.getByRole('heading', {name: 'Where could composition go next?'})).toBeInTheDocument()
    await browserUserEvent.click(page.getByRole('button', {name: 'Platform & performance', exact: true}))
    const reset = screen.getByRole('list', {name: 'Platform and performance capabilities'})
    expect(reset.querySelector('[data-active="true"]')).toHaveTextContent('Popover API')
    expect(getComputedStyle(reset).transform).toBe('none')
  })

  it.each([400, 1000, 1600])('keeps the centered capability inside the wheel at %s px', async width => {
    await page.viewport(width, 1000)
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: 'Platform & performance', exact: true}))
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(1_200))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    const capabilities = screen.getByRole('list', {name: 'Platform and performance capabilities'})
    const active = capabilities.querySelector('[data-active="true"]')!
    const bounds = active.getBoundingClientRect()
    const viewport = capabilities.parentElement!.getBoundingClientRect()
    expect(active).toHaveTextContent('CSS Anchor Positioning')
    expect(bounds.left).toBeGreaterThanOrEqual(viewport.left)
    expect(bounds.right).toBeLessThanOrEqual(viewport.right)
    expect(active.scrollWidth).toBeLessThanOrEqual(active.clientWidth)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width)
  })

  it.each([0, 1, 2, 3])('crossfades fill and opacity on entry and exit for capability pair %s', async index => {
    renderFilm('slideshow')
    await browserUserEvent.click(page.getByRole('button', {name: 'Platform & performance', exact: true}))
    const capabilities = screen.getByRole('list', {name: 'Platform and performance capabilities'})
    const first = capabilities.children[index]
    const second = capabilities.children[index + 1]
    const pointer = capabilities.parentElement!.querySelector('[aria-hidden="true"]')!
    expect(getComputedStyle(capabilities.children[0]).color).toBe('rgb(0, 0, 0)')
    expect(getComputedStyle(pointer).color).toBe('rgb(0, 0, 0)')
    expect(getComputedStyle(second).color).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(second).getPropertyValue('-webkit-text-stroke-width')).toBe('1px')
    expect(getComputedStyle(second).getPropertyValue('-webkit-text-stroke-color')).toBe('rgb(0, 0, 0)')
    expect(Number(getComputedStyle(second).opacity)).toBe(0.6)
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(index * 1_200 + 900))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    const departingFill = getComputedStyle(first).color
    const enteringFill = getComputedStyle(second).color
    const departingOpacity = Number(getComputedStyle(first).opacity)
    const enteringOpacity = Number(getComputedStyle(second).opacity)
    expect(departingFill).not.toBe('rgb(0, 0, 0)')
    expect(departingFill).not.toBe('rgba(0, 0, 0, 0)')
    expect(enteringFill).not.toBe('rgb(0, 0, 0)')
    expect(enteringFill).not.toBe('rgba(0, 0, 0, 0)')
    expect(departingOpacity).toBeGreaterThan(0.6)
    expect(departingOpacity).toBeLessThan(1)
    expect(enteringOpacity).toBeGreaterThan(0.6)
    expect(enteringOpacity).toBeLessThan(1)
    expect(getComputedStyle(first).getPropertyValue('-webkit-text-stroke-color')).toBe('rgb(0, 0, 0)')
    await act(() => vi.advanceTimersByTimeAsync(1_000))
    expect(getComputedStyle(first).color).toBe(departingFill)
    expect(getComputedStyle(second).color).toBe(enteringFill)
    expect(Number(getComputedStyle(first).opacity)).toBe(departingOpacity)
    expect(Number(getComputedStyle(second).opacity)).toBe(enteringOpacity)
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(100))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    expect(Number(getComputedStyle(first).opacity)).toBeLessThan(departingOpacity)
    expect(Number(getComputedStyle(second).opacity)).toBeGreaterThan(enteringOpacity)
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    await act(() => vi.advanceTimersByTimeAsync(200))
    await browserUserEvent.click(page.getByRole('button', {name: 'Pause', exact: true}))
    expect(getComputedStyle(first).color).toBe('rgba(0, 0, 0, 0)')
    expect(getComputedStyle(second).color).toBe('rgb(0, 0, 0)')
    expect(getComputedStyle(first).opacity).toBe('0.6')
    expect(getComputedStyle(second).opacity).toBe('1')
  })

  it('seeks to native foundations and cycles their highlighted building blocks before closing', async () => {
    renderFilm()
    await browserUserEvent.click(page.getByRole('button', {name: 'Platform & performance', exact: true}))
    expect(screen.getByLabelText('Film time')).toHaveTextContent('43000')
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Platform & performance.')
    expect(screen.getByRole('button', {name: 'Platform & performance'})).toHaveAttribute('aria-current', 'step')
    const parts = screen.getByRole('group', {name: 'Building blocks in this scene'})
    expect(parts.querySelector('[data-active="true"]')).toHaveTextContent('Native dialog')
    await browserUserEvent.click(page.getByRole('button', {name: 'Resume', exact: true}))
    for (const part of ['CSS anchors', 'Popover', 'Invokers']) {
      await act(() => vi.advanceTimersByTimeAsync(3_000))
      expect(parts.querySelectorAll('[data-active="true"]')).toHaveLength(1)
      expect(parts.querySelector('[data-active="true"]')).toHaveTextContent(part)
    }
    await act(() => vi.advanceTimersByTimeAsync(3_000))
    expect(screen.getByRole('button', {name: "What's next?"})).toHaveAttribute('aria-current', 'step')
    await act(() => vi.advanceTimersByTimeAsync(SHOWCASE_NEXT_DURATION))
    expect(screen.getByRole('button', {name: 'Primer'})).toHaveAttribute('aria-current', 'step')
    expect(screen.getByLabelText('Film time')).toHaveTextContent('55000')
  })

  it('shows scripted key cues during recording without requiring keyboard input', async () => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime})
    renderFilm()
    await user.click(screen.getByRole('button', {name: 'Extend'}))
    expect(screen.getByRole('group', {name: 'Demonstrated keyboard input'})).toHaveAttribute(
      'data-key-cue',
      'ArrowDown',
    )
    const cue = screen.getByRole('group', {name: 'Demonstrated keyboard input'})
    expect(cue).toHaveAccessibleDescription('Focus the reviewer')
    expect(cue).not.toHaveTextContent('Focus the reviewer')
    const keycap = cue.querySelector('kbd > span')!
    expect(getComputedStyle(keycap).fontSize).toBe('16px')
    expect(keycap.getBoundingClientRect().height).toBeGreaterThanOrEqual(40)
    await user.click(screen.getByRole('button', {name: 'Resume'}))
    await act(() => vi.advanceTimersByTimeAsync(2_500))
    expect(screen.getByRole('group', {name: 'Demonstrated keyboard input'})).toHaveAttribute(
      'data-key-cue',
      'Mod+Shift+U',
    )
    await user.click(screen.getByRole('button', {name: 'Customize'}))
    expect(screen.getByLabelText('Film time')).toHaveTextContent('20000')
    expect(screen.queryByRole('group', {name: 'Demonstrated keyboard input'})).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Customize'})).toHaveFocus()
  })

  it.each([400, 1000, 1600])('fits the entire desktop preview into a %s px host', async width => {
    await page.viewport(width, 1000)
    renderFilm()
    await waitFor(() => {
      const region = screen.getByRole('region', {name: 'Scripted product demonstration'}).getBoundingClientRect()
      const device = screen.getByLabelText('Film time').parentElement!.getBoundingClientRect()
      expect(device.left).toBeGreaterThanOrEqual(region.left)
      expect(device.right).toBeLessThanOrEqual(region.right)
    })
  })

  it('waits for the preview before enabling playback', () => {
    render(<SelectPanelShowcase renderPreview={() => <p>Loading film</p>} />)
    expect(screen.getByRole('button', {name: 'Play demo'})).toBeDisabled()
    expect(screen.getByRole('button', {name: 'Record mode'})).toBeDisabled()
  })

  it('starts on demand, pauses without jumping and resumes', async () => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime})
    renderFilm()
    expect(screen.getByLabelText('Film time')).toHaveTextContent('0')
    await user.click(screen.getByRole('button', {name: 'Play demo'}))
    await act(() => vi.advanceTimersByTimeAsync(8_000))
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Choose the parts you need.')
    await user.click(screen.getByRole('button', {name: 'Pause'}))
    await act(() => vi.advanceTimersByTimeAsync(5_000))
    expect(screen.getByLabelText('Film time')).toHaveTextContent('8000')
    await user.click(screen.getByRole('button', {name: 'Resume'}))
    await act(() => vi.advanceTimersByTimeAsync(1_000))
    expect(screen.getByLabelText('Film time')).toHaveTextContent('9000')
  })

  it('finishes once, cleans up the clock, and replays from the beginning', async () => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime})
    const {unmount} = renderFilm()
    await user.click(screen.getByRole('button', {name: 'Play demo'}))
    await act(() => vi.advanceTimersByTimeAsync(getShowcaseDuration('split')))
    expect(screen.getByRole('button', {name: 'Replay'})).toBeVisible()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    expect(vi.getTimerCount()).toBe(0)
    await user.click(screen.getByRole('button', {name: 'Replay'}))
    expect(screen.getByLabelText('Film time')).toHaveTextContent('0')
    expect(screen.getByRole('button', {name: 'Pause'})).toBeVisible()
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('can seek directly to a chapter without starting playback', async () => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime})
    renderFilm()
    await user.click(screen.getByRole('button', {name: 'Adapt'}))
    expect(screen.getByRole('heading', {level: 1})).toHaveTextContent('Change the container.')
    expect(screen.getByRole('button', {name: 'Adapt'})).toHaveAttribute('aria-current', 'step')
    expect(screen.getByLabelText('Film time')).toHaveTextContent('38000')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('counts down into a clean recording and Escape restores paused controls', async () => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime})
    renderFilm()
    await user.click(screen.getByRole('button', {name: 'Record mode'}))
    expect(screen.getByRole('main')).toHaveAttribute('data-recording', 'true')
    expect(screen.getByRole('status', {name: 'Recording countdown'})).toHaveTextContent('3')
    expect(screen.queryByRole('button', {name: 'Pause'})).not.toBeInTheDocument()
    await act(() => vi.advanceTimersByTimeAsync(3_000))
    expect(screen.queryByRole('status', {name: 'Recording countdown'})).not.toBeInTheDocument()
    expect(screen.getByLabelText('Film time')).toHaveTextContent('0')
    expect(screen.getByRole('group', {name: 'Demonstrated keyboard input'})).toHaveAttribute('data-key-cue', 'Enter')
    await act(() => vi.advanceTimersByTimeAsync(1_000))
    fireEvent.keyDown(document, {key: 'Escape'})
    expect(screen.getByRole('main')).toHaveAttribute('data-recording', 'false')
    expect(screen.getByRole('button', {name: 'Resume'})).toBeVisible()
    expect(screen.getByLabelText('Film time')).toHaveTextContent('1000')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('pauses when the browser tab is hidden rather than skipping scenes', async () => {
    const user = userEvent.setup({advanceTimers: vi.advanceTimersByTime})
    renderFilm()
    await user.click(screen.getByRole('button', {name: 'Play demo'}))
    await act(() => vi.advanceTimersByTimeAsync(2_000))
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    fireEvent(document, new Event('visibilitychange'))
    await act(() => vi.advanceTimersByTimeAsync(5_000))
    expect(screen.getByLabelText('Film time')).toHaveTextContent('2000')
    expect(screen.getByRole('button', {name: 'Resume'})).toBeVisible()
  })
})
