import {render, screen, waitFor, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {ThemeProvider} from '../../ThemeProvider'
import {FeatureFlags} from '../../FeatureFlags'
import {MatchMediaContext} from '../../hooks/MatchMediaContext'
import {ShowcaseSurface} from './ShowcaseSurface'
import {showcaseReviewers, SHOWCASE_THEME_PLAYBACK_DURATION} from './showcase'

function Surface({elapsedMs, playing = false}: {elapsedMs: number; playing?: boolean}) {
  return (
    <ThemeProvider colorMode="day">
      <BaseStyles>
        <ShowcaseSurface elapsedMs={elapsedMs} playing={playing} />
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('SelectPanel showcase surface', () => {
  it('keeps customization centered when native anchor positioning is enabled', async () => {
    await page.viewport(800, 720)
    render(
      <FeatureFlags flags={{primer_react_css_anchor_positioning: true}}>
        <Surface elapsedMs={20_750} />
      </FeatureFlags>,
    )
    const dialog = screen.getByRole('dialog', {name: 'Request reviewers'})
    expect(dialog).toHaveAttribute('data-anchor-position', 'false')
    await waitFor(() => {
      const bounds = dialog.getBoundingClientRect()
      expect(bounds.left + bounds.width / 2).toBeCloseTo(400, 0)
      expect(bounds.top + bounds.height / 2).toBeCloseTo(360, 0)
    })
  })

  it('introduces customization with a text-only card matching the closing-card treatment', async () => {
    await page.viewport(800, 720)
    render(<Surface elapsedMs={17_000} />)
    expect(screen.getByRole('heading', {name: /Composable by design/})).toHaveTextContent('Yours to customize.')
    expect(screen.getByText('More ways to shape the look and feel of SelectPanel.')).toBeInTheDocument()
    expect(screen.queryByRole('complementary', {hidden: true})).not.toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
  })

  it.each([23_000, 29_000])(
    'omits the visible heading without losing the accessible title at %s ms',
    async elapsedMs => {
      await page.viewport(800, 720)
      render(<Surface elapsedMs={elapsedMs} />)
      const dialog = screen.getByRole('dialog', {name: 'Request reviewers'})
      expect(dialog.querySelector('[data-select-panel-part="Header"]')).toBeNull()
      const title = within(dialog).getByRole('heading', {name: 'Request reviewers'})
      expect(title.getBoundingClientRect().width).toBeLessThanOrEqual(1)
      expect(title.getBoundingClientRect().height).toBeLessThanOrEqual(1)
      expect(within(dialog).getByRole('textbox', {name: 'Search reviewers'})).toBeInTheDocument()
    },
  )

  it('keeps Base UI heading spacing compact', async () => {
    await page.viewport(800, 720)
    render(<Surface elapsedMs={26_000} />)
    const header = document.querySelector('[data-select-panel-part="Header"]')!
    const title = screen.getByRole('heading', {name: 'Request reviewers'})
    const panel = document.querySelector('[data-select-panel-part="Content"]')!
    expect(getComputedStyle(header).padding).toBe('0px 8px')
    expect(getComputedStyle(title).margin).toBe('0px')
    expect(header.getBoundingClientRect().height).toBeCloseTo(title.getBoundingClientRect().height, 0)
    expect(title.getBoundingClientRect().top - panel.getBoundingClientRect().top).toBeLessThanOrEqual(10)
  })

  it('sizes the sidebar enhancement label to its contents instead of stretching it', async () => {
    await page.viewport(800, 720)
    render(<Surface elapsedMs={0} />)
    const label = screen.getByText('enhancement')
    const text = document.createRange()
    text.selectNodeContents(label)
    const style = getComputedStyle(label)
    const horizontalSpacing =
      Number.parseFloat(style.paddingLeft) +
      Number.parseFloat(style.paddingRight) +
      Number.parseFloat(style.borderLeftWidth) +
      Number.parseFloat(style.borderRightWidth)
    expect(style.justifySelf).toBe('start')
    expect(label.getBoundingClientRect().width).toBeCloseTo(text.getBoundingClientRect().width + horizontalSpacing, 0)
    expect(label.getBoundingClientRect().width).toBeLessThan(label.parentElement!.getBoundingClientRect().width)
  })

  it.each([
    [20_000, true],
    [23_000, false],
    [26_000, true],
    [29_000, true],
    [32_000, false],
    [35_000, false],
  ] as const)('shows the intended footer for each customization at %s ms', async (elapsedMs, hasFooter) => {
    await page.viewport(800, 720)
    render(<Surface elapsedMs={elapsedMs} />)
    expect(document.querySelector('[data-select-panel-part="Footer"]') !== null).toBe(hasFooter)
    expect(screen.queryByRole('button', {name: 'Save'}) !== null).toBe(hasFooter)
    expect(screen.queryByRole('button', {name: 'Cancel'}) !== null).toBe(hasFooter)
    expect(screen.queryByText('2 selected') !== null).toBe(hasFooter)
  })

  it.each([
    [10_000, true],
    [20_000, true],
    [23_000, true],
    [26_000, true],
    [29_000, true],
    [32_000, true],
    [35_000, false],
  ] as const)('only omits search for the Windows 98 customization at %s ms', async (elapsedMs, hasSearch) => {
    await page.viewport(800, 720)
    render(<Surface elapsedMs={elapsedMs + 750} />)
    const dialog = page.getByRole('dialog', {name: 'Request reviewers'}).element()
    expect(dialog.querySelector('input[aria-label="Search reviewers"]') !== null).toBe(hasSearch)
    const list = page.getByRole('listbox', {name: 'Reviewers'}).element()
    expect(list.querySelectorAll('[role="option"]')).toHaveLength(showcaseReviewers.length)
    expect(list.querySelectorAll('[aria-selected="true"]')).toHaveLength(2)
  })

  it.each([
    [20_000, '14px', '14px', '12px'],
    [23_000, '12px', '13px', '12px'],
    [26_000, '14px', '14px', '12px'],
    [29_000, '14px', '14px', '12px'],
    [32_000, '12px', '12px', '12px'],
    [35_000, '12px', '12px', '11px'],
  ] as const)(
    'preserves the title, label and description hierarchy at %s ms',
    async (elapsedMs, titleSize, bodySize, metaSize) => {
      await page.viewport(800, 720)
      render(<Surface elapsedMs={elapsedMs} />)
      const option = screen.getAllByRole('option')[0]
      const label = within(option).getByText(showcaseReviewers[0].name)
      const description = within(option).getByText(showcaseReviewers[0].description)
      expect(getComputedStyle(screen.getByRole('heading', {name: 'Request reviewers'})).fontSize).toBe(titleSize)
      expect(getComputedStyle(label).fontSize).toBe(bodySize)
      expect(getComputedStyle(label).lineHeight).toBe('20px')
      expect(getComputedStyle(label).fontWeight).toBe('600')
      expect(getComputedStyle(description).fontSize).toBe(metaSize)
      expect(getComputedStyle(description).lineHeight).toBe('16px')
      expect(getComputedStyle(description).fontWeight).toBe('400')
    },
  )

  it.each([
    [26_000, '6px'],
    [29_000, '8px'],
  ] as const)('keeps modern skin row density aligned with Primer at %s ms', async (elapsedMs, panelPadding) => {
    await page.viewport(800, 720)
    const {rerender} = render(<Surface elapsedMs={20_000} />)
    const nativeHeight = screen.getAllByRole('option')[0].getBoundingClientRect().height
    rerender(<Surface elapsedMs={elapsedMs} />)
    const option = screen.getAllByRole('option')[0]
    const content = screen.getByRole('listbox').parentElement!
    expect(getComputedStyle(option.querySelector('[data-size]')!).padding).toBe('6px 8px')
    expect(option.getBoundingClientRect().height).toBeCloseTo(nativeHeight, 0)
    expect(getComputedStyle(content).padding).toBe(panelPadding)
    expect(getComputedStyle(content).gap).toBe('8px')
  })

  it.each([
    [20_000, 'Primer'],
    [23_000, 'GitHub App'],
    [26_000, 'Base UI-inspired'],
    [29_000, 'Paper'],
    [32_000, 'Terminal'],
    [35_000, 'Windows 98'],
  ] as const)('indicates the current theme with a segmented control at %s ms', async (elapsedMs, name) => {
    await page.viewport(1000, 800)
    render(<Surface elapsedMs={elapsedMs} />)
    const caption = screen.getByRole('banner', {name: 'Theme preview', hidden: true})
    const control = within(caption).getByRole('list', {name: 'Showcase themes', hidden: true})
    expect(within(control).getAllByRole('button', {hidden: true})).toHaveLength(6)
    expect(within(control).getByRole('button', {name, hidden: true})).toHaveAttribute('aria-pressed', 'true')
    expect(control.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1)
    expect(within(caption).queryByRole('heading', {hidden: true})).not.toBeInTheDocument()
    expect(caption.querySelector('p')).toBeNull()
    expect(screen.queryByRole('complementary', {hidden: true})).not.toBeInTheDocument()
    expect(screen.queryByText('A more composable SelectPanel')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Overview', hidden: true})).not.toBeInTheDocument()
  })

  it('slides the old skin left and the next skin in from the right without remounting or changing selection', async () => {
    await page.viewport(800, 720)
    const {rerender} = render(<Surface elapsedMs={22_900} />)
    const dialog = screen.getByRole('dialog', {name: 'Request reviewers'})
    const backdrop = document.querySelector('[data-showcase-theme-backdrop]')!
    const outgoingOpacity = Number(getComputedStyle(dialog).opacity)
    const outgoingTransform = new DOMMatrixReadOnly(getComputedStyle(dialog).transform)
    expect(outgoingTransform.m41).toBeLessThan(0)
    expect(outgoingOpacity).toBeGreaterThan(0)
    expect(outgoingOpacity).toBeLessThan(1)
    expect(getComputedStyle(backdrop).opacity).toBe(getComputedStyle(dialog).opacity)
    rerender(<Surface elapsedMs={23_000} />)
    expect(screen.getByRole('dialog', {name: 'Request reviewers'})).toBe(dialog)
    expect(getComputedStyle(dialog).opacity).toBe('0')
    expect(dialog.getBoundingClientRect().left).toBeGreaterThanOrEqual(800)
    rerender(<Surface elapsedMs={23_250} />)
    expect(Number(getComputedStyle(dialog).opacity)).toBeCloseTo(0.5, 2)
    expect(new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m41).toBeGreaterThan(0)
    expect(getComputedStyle(backdrop).opacity).toBe(getComputedStyle(dialog).opacity)
    rerender(<Surface elapsedMs={23_500} />)
    expect(getComputedStyle(dialog).opacity).toBe('1')
    expect(new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m41).toBe(0)
    expect(within(dialog).getAllByRole('option', {selected: true})).toHaveLength(2)
    expect(document.activeElement).not.toBe(within(dialog).getByRole('textbox'))
  })

  it('synchronizes theme movement with pause, resume and chapter seeking', async () => {
    const {rerender} = render(<Surface elapsedMs={23_250} />)
    const dialog = screen.getByRole('dialog', {name: 'Request reviewers'})
    const fade = dialog
      .getAnimations()
      .find(animation => animation.effect?.getComputedTiming().duration === SHOWCASE_THEME_PLAYBACK_DURATION)!
    expect(fade.currentTime).toBe(125)
    expect(fade.playState).toBe('paused')
    rerender(<Surface elapsedMs={23_250} playing />)
    expect(fade.playState).toBe('running')
    rerender(<Surface elapsedMs={23_400} />)
    expect(fade.currentTime).toBe(200)
    expect(fade.playState).toBe('paused')
    rerender(<Surface elapsedMs={26_500} />)
    expect(fade.playState).toBe('idle')
    expect(getComputedStyle(dialog).opacity).toBe('1')
    const control = screen.getByRole('list', {name: 'Showcase themes', hidden: true})
    expect(within(control).getByRole('button', {name: 'Base UI-inspired', hidden: true})).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('moves the selection through every theme without remounting or painting an opaque track or wrapper', async () => {
    const {rerender} = render(<Surface elapsedMs={20_500} />)
    const caption = screen.getByRole('banner', {name: 'Theme preview', hidden: true})
    const control = within(caption).getByRole('list', {name: 'Showcase themes', hidden: true})
    for (const [elapsedMs, name] of [
      [20_500, 'Primer'],
      [23_500, 'GitHub App'],
      [26_500, 'Base UI-inspired'],
      [29_500, 'Paper'],
      [32_500, 'Terminal'],
      [35_500, 'Windows 98'],
    ] as const) {
      rerender(<Surface elapsedMs={elapsedMs} />)
      expect(within(caption).getByRole('list', {name: 'Showcase themes', hidden: true})).toBe(control)
      expect(within(control).getByRole('button', {name, hidden: true})).toHaveAttribute('aria-pressed', 'true')
      expect(control.querySelectorAll('[aria-pressed="true"]')).toHaveLength(1)
      expect(getComputedStyle(control).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(caption).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(control.parentElement).toBe(caption)
    }
  })

  it('shows the selected skin immediately without movement when reduced motion is requested', async () => {
    render(
      <MatchMediaContext.Provider value={{'(prefers-reduced-motion: reduce)': true}}>
        <Surface elapsedMs={23_000} playing />
      </MatchMediaContext.Provider>,
    )
    const dialog = screen.getByRole('dialog', {name: 'Request reviewers'})
    expect(getComputedStyle(dialog).opacity).toBe('1')
    expect(getComputedStyle(dialog).transform).toBe('none')
    expect(
      dialog
        .getAnimations()
        .some(animation => animation.effect?.getComputedTiming().duration === SHOWCASE_THEME_PLAYBACK_DURATION),
    ).toBe(false)
  })

  it('cancels theme movement immediately when reduced motion changes and restores the paused position', () => {
    const fixture = (reducedMotion: boolean) => (
      <MatchMediaContext.Provider value={{'(prefers-reduced-motion: reduce)': reducedMotion}}>
        <Surface elapsedMs={23_250} />
      </MatchMediaContext.Provider>
    )
    const {rerender} = render(fixture(false))
    const dialog = page.getByRole('dialog', {name: 'Request reviewers'}).element()
    const transform = getComputedStyle(dialog).transform
    expect(new DOMMatrixReadOnly(transform).m41).toBeGreaterThan(0)
    rerender(fixture(true))
    expect(getComputedStyle(dialog).transform).toBe('none')
    expect(getComputedStyle(dialog).opacity).toBe('1')
    rerender(fixture(false))
    expect(getComputedStyle(dialog).transform).toBe(transform)
    const animation = dialog
      .getAnimations()
      .find(candidate => candidate.effect?.getComputedTiming().duration === SHOWCASE_THEME_PLAYBACK_DURATION)!
    expect(animation.playState).toBe('paused')
    expect(animation.currentTime).toBe(125)
  })

  it.each([20_000, 35_000])('slides the first and last themes consistently at %s ms', elapsedMs => {
    const {rerender} = render(<Surface elapsedMs={elapsedMs} />)
    const dialog = page.getByRole('dialog', {name: 'Request reviewers'}).element()
    expect(new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m41).toBeGreaterThan(0)
    rerender(<Surface elapsedMs={elapsedMs + 1_500} />)
    expect(getComputedStyle(dialog).opacity).toBe('1')
    expect(new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m41).toBe(0)
    rerender(<Surface elapsedMs={elapsedMs + 2_900} />)
    expect(new DOMMatrixReadOnly(getComputedStyle(dialog).transform).m41).toBeLessThan(0)
  })

  it.each([
    [1_500, true],
    [10_000, true],
    [16_000, false],
  ] as const)('keeps the panel and collection within the preview at %s ms', async (elapsedMs, hasAnatomy) => {
    await page.viewport(800, 720)
    const {container} = render(<Surface elapsedMs={elapsedMs} />)
    await waitFor(() => {
      expect(screen.getByRole('dialog', {name: 'Request reviewers'})).toHaveAttribute('data-variant', 'anchored')
      const origin = container.getBoundingClientRect()
      const panels = [...screen.queryAllByRole('dialog'), ...screen.queryAllByRole('listbox')]
      expect(panels.length).toBeGreaterThan(0)
      for (const panel of panels) {
        const bounds = panel.getBoundingClientRect()
        expect(bounds.left).toBeGreaterThanOrEqual(origin.left)
        expect(bounds.right).toBeLessThanOrEqual(origin.left + 800)
        expect(bounds.top).toBeGreaterThanOrEqual(origin.top)
        expect(bounds.bottom).toBeLessThanOrEqual(origin.top + 720)
      }
      const callout = document.querySelector('[data-anatomy-callout]')
      expect(callout !== null).toBe(hasAnatomy)
      if (!callout) return
      const badge = callout.getBoundingClientRect()
      expect(badge.left).toBeGreaterThanOrEqual(0)
      expect(badge.right).toBeLessThanOrEqual(800)
      expect(badge.top).toBeGreaterThanOrEqual(0)
      expect(badge.bottom).toBeLessThanOrEqual(720)
    })
  })

  it('renders real controlled options and search from the script', async () => {
    await page.viewport(1000, 800)
    const {container, rerender} = render(<Surface elapsedMs={3_200 + showcaseReviewers[1].id.length * 80} />)
    expect(container.querySelector('[data-scene]')).toHaveProperty('inert', true)
    expect(screen.getByRole('dialog')).toHaveAttribute('data-variant', 'anchored')
    expect(screen.getByRole('textbox')).toHaveValue(showcaseReviewers[1].id)
    expect(screen.getAllByRole('option')).toHaveLength(1)
    rerender(<Surface elapsedMs={5_400} />)
    expect(screen.getByRole('option', {name: showcaseReviewers[1].name})).toHaveAttribute('aria-selected', 'true')
  })

  it('renders a composed footer and only one independent nested row action', async () => {
    await page.viewport(1000, 800)
    const {rerender} = render(<Surface elapsedMs={10_000} />)
    expect(screen.getByText('2 selected')).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Save'})).toBeInTheDocument()
    rerender(<Surface elapsedMs={16_000} />)
    expect(
      screen.getByRole('listbox').querySelectorAll('[data-component="SelectPanel.Item.SecondaryAction"]'),
    ).toHaveLength(1)
    const details = screen.getByRole('dialog', {name: showcaseReviewers[0].name})
    expect(details).not.toHaveAttribute('data-select-panel-part')
    expect(within(details).getByRole('button', {name: 'Close'})).toBeInTheDocument()
  })

  it.each([1000, 375])('shows a reviewer heading and linked bio without an avatar at %s px', async width => {
    await page.viewport(width, 800)
    render(<Surface elapsedMs={16_000} />)
    const details = screen.getByRole('dialog', {name: showcaseReviewers[0].name})
    const heading = within(details).getByRole('heading', {name: showcaseReviewers[0].name})
    expect(details.querySelector('img')).toBeNull()
    expect(within(details).getByRole('link', {name: '@github'})).toHaveAttribute('href', 'https://github.com/github')
    expect(within(details).getByRole('link', {name: '@primer'})).toHaveAttribute('href', 'https://github.com/primer')
    expect(within(details).getByText(/design systems engineer at/i)).toHaveTextContent(
      'Design systems engineer at @github @primer.',
    )
    expect(within(details).queryByText('Suggested reviewer')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(details.getBoundingClientRect().height).toBeCloseTo(160, 0)
      expect(getComputedStyle(heading).fontWeight).toBe('600')
    })
  })

  it('shows the closed mobile picker before opening the real narrow-screen overlay', async () => {
    await page.viewport(375, 700)
    const {rerender} = render(<Surface elapsedMs={38_000} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'Request reviewers'})).toBeInTheDocument()
    rerender(<Surface elapsedMs={39_499} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    rerender(<Surface elapsedMs={39_500} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('data-variant', 'fullscreen')
  })

  it.each([20_000, 23_000, 26_000, 29_000, 32_000, 35_000])(
    'centers only the anchored picker at %s ms',
    async elapsedMs => {
      await page.viewport(800, 720)
      render(<Surface elapsedMs={elapsedMs + 750} />)
      expect(screen.getByRole('listbox')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toHaveAttribute('data-variant', 'anchored')
      expect(screen.queryByRole('complementary', {hidden: true})).not.toBeInTheDocument()
      expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
      await waitFor(() => {
        const bounds = screen.getByRole('dialog').getBoundingClientRect()
        expect(bounds.left + bounds.width / 2).toBeCloseTo(400, 0)
        expect(bounds.top + bounds.height / 2).toBeCloseTo(360, 0)
        expect(bounds.top).toBeGreaterThan(64)
        expect(bounds.bottom).toBeLessThan(700)
      })
    },
  )

  it('blurs only the background while an overlay is open, including behind nested details', () => {
    const {rerender} = render(<Surface elapsedMs={0} />)
    const sidebar = screen.getByRole('complementary', {name: 'Pull request sidebar', hidden: true})
    expect(getComputedStyle(sidebar).filter).toBe('none')
    rerender(<Surface elapsedMs={1_500} />)
    expect(getComputedStyle(sidebar).filter).toBe('blur(3px)')
    expect(getComputedStyle(screen.getByRole('dialog')).filter).toBe('none')
    rerender(<Surface elapsedMs={16_000} />)
    expect(getComputedStyle(screen.getByRole('dialog', {name: 'Request reviewers'})).filter).toBe('blur(3px)')
    expect(getComputedStyle(screen.getByRole('dialog', {name: showcaseReviewers[0].name})).filter).toBe('none')
    rerender(<Surface elapsedMs={11_500} />)
    expect(getComputedStyle(sidebar).filter).toBe('none')
  })

  it('highlights only the action row without changing the saved selection', () => {
    render(<Surface elapsedMs={14_500} />)
    const rows = screen.getAllByRole('option')
    expect(rows.filter(row => row.getAttribute('aria-selected') === 'true')).toHaveLength(2)
    expect(rows.filter(row => row.getAttribute('data-highlighted') === 'true')).toEqual([rows[0]])
    const restBackground = getComputedStyle(rows[rows.length - 1]).backgroundColor
    expect(getComputedStyle(rows[0]).backgroundColor).not.toBe(restBackground)
    for (const row of rows.slice(1)) {
      expect(getComputedStyle(row).backgroundColor).toBe(restBackground)
    }
  })

  it('ends with the compatibility and foundation message', () => {
    render(<Surface elapsedMs={58_000} />)
    expect(screen.getByText('Existing SelectPanel API remains available')).toBeInTheDocument()
    expect(screen.getByText('Built on Primer, without Base UI')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
  })

  it.each([
    [43_000, 'dialog', 'Modality belongs to the browser.', 'dialog.showModal()'],
    [46_000, 'anchors', 'Keep placement in CSS.', 'position-anchor: --reviewers;'],
    [49_000, 'popover', 'Rise above stacking contexts.', 'renderAs="popover"'],
    [52_000, 'invokers', 'Declare the action and its target.', 'commandfor="reviewers"'],
  ] as const)(
    'spotlights the native API and its benefit at %s ms without opening a modal',
    async (elapsedMs, id, title, code) => {
      await page.viewport(800, 720)
      const {container} = render(<Surface elapsedMs={elapsedMs} />)
      const stage = screen.getByRole('region', {name: 'Native platform experiments'})
      const features = within(stage).getByRole('group', {name: 'Native platform features'})
      expect(features.children).toHaveLength(4)
      expect(features.querySelectorAll('[data-active="true"]')).toHaveLength(1)
      expect(features.querySelector('[data-active="true"]')).toHaveAttribute('data-platform-feature', id)
      expect(within(stage).getByRole('heading', {name: title})).toBeInTheDocument()
      expect(stage.querySelector('code')).toHaveTextContent(code)
      expect(stage).toHaveTextContent('Opt-in proofs of concept, not the current default.')
      expect(container.querySelector('[data-scene]')).toHaveProperty('inert', true)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.queryByRole('complementary', {hidden: true})).not.toBeInTheDocument()
      expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
      await waitFor(() => {
        const bounds = stage.getBoundingClientRect()
        expect(bounds.left).toBeGreaterThanOrEqual(0)
        expect(bounds.top).toBeGreaterThanOrEqual(0)
        expect(bounds.right).toBeLessThanOrEqual(800)
        expect(bounds.bottom).toBeLessThanOrEqual(720)
      })
    },
  )

  it('automatically annotates the requested parts and pauses for the standard details Dialog', async () => {
    await page.viewport(800, 720)
    const {rerender} = render(<Surface elapsedMs={4_500} />)
    expect(await screen.findByText('SearchIcon', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    rerender(<Surface elapsedMs={14_500} />)
    expect(await screen.findByText('InfoIcon', {selector: '[data-anatomy-name]'})).toBeInTheDocument()
    rerender(<Surface elapsedMs={16_000} />)
    expect(screen.getByRole('dialog', {name: showcaseReviewers[0].name})).toBeInTheDocument()
    expect(document.querySelector('[data-anatomy-callout]')).toBeNull()
  })

  it('keeps the native feature cards stationary as the API snippets change height', async () => {
    await page.viewport(800, 720)
    const {rerender} = render(<Surface elapsedMs={43_000} />)
    const stage = screen.getByRole('region', {name: 'Native platform experiments'})
    const initial = stage.getBoundingClientRect()
    for (const elapsedMs of [46_000, 49_000, 52_000]) {
      rerender(<Surface elapsedMs={elapsedMs} />)
      const bounds = stage.getBoundingClientRect()
      expect(bounds.top).toBeCloseTo(initial.top, 0)
      expect(bounds.height).toBeCloseTo(initial.height, 0)
    }
  })

  it('uses the requested reviewers and their exact avatar URLs', async () => {
    await page.viewport(800, 720)
    render(<Surface elapsedMs={20_000} />)
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(showcaseReviewers.length)
    for (const [index, reviewer] of showcaseReviewers.entries()) {
      expect(within(options[index]).getByText(reviewer.name)).toBeInTheDocument()
      expect(within(options[index]).getByText(reviewer.description)).toBeInTheDocument()
      expect(options[index].querySelector('img')).toHaveAttribute('src', reviewer.avatarUrl)
    }
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  })
})
