import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {ThemeProvider} from '../../ThemeProvider'
import BaseStyles from '../../BaseStyles'
import {SelectPanel} from '../index'
import {SelectPanelPlayground} from './SelectPanelPlayground'
import {SelectPanelDemo} from './SelectPanelDemo'
import {defaultConfig, presets} from './model'
import type {SelectPanelDemoProps} from './SelectPanelDemo'

function preview({config, resetKey}: SelectPanelDemoProps) {
  return <div data-testid="preview">{JSON.stringify({config, resetKey})}</div>
}

describe('SelectPanel playground', () => {
  it('toggles anatomy without resetting the preview or changing its recipe', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    const toggle = screen.getByRole('button', {name: 'Show anatomy'})
    expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview')).toHaveTextContent('"anatomy":true')
    expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":0')
    expect(screen.getByRole('combobox', {name: 'Recipe'})).toHaveValue('repositories')
    await user.selectOptions(screen.getByRole('combobox', {name: 'Recipe'}), 'review')
    expect(screen.getByTestId('preview')).toHaveTextContent('"anatomy":true')
    await user.click(toggle)
    expect(screen.getByTestId('preview')).toHaveTextContent('"anatomy":false')
    expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":1')
  })

  it('defaults to dark outside a host theme', () => {
    render(<SelectPanelPlayground renderPreview={preview} />)
    const theme = screen.getByRole('main').closest('[data-color-mode]')
    expect(theme).toHaveAttribute('data-color-mode', 'dark')
    expect(theme).toHaveAttribute('data-dark-theme', 'dark')
  })

  it('inherits an explicit host theme and responds to theme changes', () => {
    const {rerender} = render(
      <ThemeProvider colorMode="day">
        <SelectPanelPlayground renderPreview={preview} />
      </ThemeProvider>,
    )
    expect(screen.getByRole('main').closest('[data-color-mode]')).toHaveAttribute('data-color-mode', 'light')
    const surface = screen.getByTestId('preview')
    rerender(
      <ThemeProvider colorMode="night" nightScheme="dark_high_contrast">
        <SelectPanelPlayground renderPreview={preview} />
      </ThemeProvider>,
    )
    const theme = screen.getByRole('main').closest('[data-color-mode]')
    expect(theme).toHaveAttribute('data-color-mode', 'dark')
    expect(theme).toHaveAttribute('data-dark-theme', 'dark_high_contrast')
    expect(screen.getByTestId('preview')).toBe(surface)
  })

  it('keeps the desktop viewport above the mobile breakpoint in a keyboard-accessible canvas', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    const canvas = screen.getByRole('region', {name: 'Interactive preview canvas'})
    expect(canvas).toHaveAttribute('tabindex', '0')
    expect(canvas.firstElementChild!.getBoundingClientRect().width).toBeGreaterThanOrEqual(800)
    canvas.focus()
    expect(canvas).toHaveFocus()

    await user.click(screen.getByRole('button', {name: 'Mobile'}))
    expect(canvas).toHaveAttribute('tabindex', '0')
    expect(canvas.firstElementChild!.getBoundingClientRect().width).toBeLessThanOrEqual(375)
    expect(screen.getByRole('button', {name: 'Mobile'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":0')
  })

  it('offers six appearance styles at the top of Composition without resetting the preview', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    const inspector = screen.getByRole('complementary', {name: 'Composition'})
    const appearance = within(inspector).getByRole('combobox', {name: 'Appearance'})
    expect(within(inspector).getAllByRole('combobox')[0]).toBe(appearance)
    expect(
      within(appearance)
        .getAllByRole('option')
        .map(option => option.textContent),
    ).toEqual(['Primer', 'Base UI-inspired', 'GitHub App', 'Windows 98', 'Paper', 'Terminal'])
    for (const value of ['1', '2', '3', '4', '5', '0']) {
      await user.selectOptions(appearance, value)
      expect(appearance).toHaveValue(value)
      expect(screen.getByTestId('preview')).toHaveTextContent(`"appearance":${value}`)
      expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":0')
    }
    expect(screen.queryByRole('button', {name: 'Appearance'})).not.toBeInTheDocument()
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Snap'})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: 'Blend'})).not.toBeInTheDocument()
  })

  it('keeps appearance when switching recipes and resets structural changes', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    await user.selectOptions(screen.getByRole('combobox', {name: 'Appearance'}), '2')
    await user.selectOptions(screen.getByRole('combobox', {name: 'Recipe'}), 'quick-pick')
    expect(screen.getByTestId('preview')).toHaveTextContent('"appearance":2')
    expect(screen.getByTestId('preview')).toHaveTextContent('"search":false')
    expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":1')
    await user.click(screen.getByRole('button', {name: 'Composition'}))
    await user.click(screen.getByRole('checkbox', {name: 'Search input'}))
    expect(screen.getByTestId('preview')).toHaveTextContent('"search":true')
    expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":2')
  })

  it('uses listbox item secondary actions and supports grouping with actions', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    await user.selectOptions(screen.getByRole('combobox', {name: 'Recipe'}), 'actions')
    expect(screen.getByRole('checkbox', {name: 'Grouped options'})).toBeEnabled()
    expect(screen.getByTestId('preview')).toHaveTextContent('"actions":true')
    await user.click(screen.getByRole('checkbox', {name: 'Grouped options'}))
    expect(screen.getByTestId('preview')).toHaveTextContent('"grouped":true')
    await user.click(screen.getByRole('button', {name: 'Code'}))
    const example = screen.getByRole('region', {name: 'React example'})
    expect(example).toHaveTextContent('secondaryActions=')
    expect(example).toHaveTextContent('SelectPanel.List')
    expect(example).not.toHaveTextContent('SelectPanel.Grid')
    expect(
      screen.getByText(/Cmd\/Ctrl\+Shift\+U opens repository details directly; closing details returns to the item/),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: 'Composition'}))
    await user.click(screen.getByRole('checkbox', {name: 'Item secondary actions'}))
    expect(screen.getByRole('checkbox', {name: 'Grouped options'})).toBeEnabled()
    expect(screen.getByTestId('preview')).toHaveTextContent('"grouped":true')
  })

  it('labels the Primer form controls and resets only structural configuration changes', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    expect(
      within(screen.getByRole('group', {name: 'Structure'})).getByRole('checkbox', {name: 'Search input'}),
    ).toBeChecked()

    await user.click(screen.getByRole('checkbox', {name: 'Multiple selection'}))
    await user.selectOptions(screen.getByRole('combobox', {name: 'Apply changes'}), 'submit')
    await user.click(within(screen.getByRole('list', {name: 'Container'})).getByRole('button', {name: 'Inline'}))
    await user.click(within(screen.getByRole('list', {name: 'Preview state'})).getByRole('button', {name: 'Loading'}))

    const state = screen.getByTestId('preview')
    expect(state).toHaveTextContent('"multiple":true')
    expect(state).toHaveTextContent('"commitMode":"submit"')
    expect(state).toHaveTextContent('"presentation":"inline"')
    expect(state).toHaveTextContent('"previewState":"loading"')
    expect(state).toHaveTextContent('"resetKey":4')
    expect(screen.getByRole('combobox', {name: 'Recipe'})).toHaveValue('custom')
    await user.selectOptions(screen.getByRole('combobox', {name: 'Appearance'}), '1')
    expect(screen.getByRole('combobox', {name: 'Appearance'})).toHaveValue('1')
    expect(state).toHaveTextContent('"resetKey":4')
  })

  it('uses labeled segmented controls for every presentation option and reflects recipe changes', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    const container = within(screen.getByRole('list', {name: 'Container'}))
    const previewState = within(screen.getByRole('list', {name: 'Preview state'}))
    expect(container.getByRole('button', {name: 'Anchored'})).toHaveAttribute('aria-pressed', 'true')
    expect(previewState.getByRole('button', {name: 'Ready'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('combobox', {name: 'Container'})).not.toBeInTheDocument()
    expect(screen.queryByRole('combobox', {name: 'Preview state'})).not.toBeInTheDocument()
    let resetKey = 0
    for (const [label, value] of [
      ['Modal', 'modal'],
      ['Inline', 'inline'],
      ['Anchored', 'anchored'],
    ]) {
      await user.click(container.getByRole('button', {name: label}))
      expect(container.getByRole('button', {name: label})).toHaveAttribute('aria-pressed', 'true')
      expect(
        container.getAllByRole('button').filter(button => button.getAttribute('aria-pressed') === 'true'),
      ).toHaveLength(1)
      expect(screen.getByTestId('preview')).toHaveTextContent(`"presentation":"${value}"`)
      resetKey += 1
      expect(screen.getByTestId('preview')).toHaveTextContent(`"resetKey":${resetKey}`)
    }
    for (const [label, value] of [
      ['Loading', 'loading'],
      ['Empty', 'empty'],
      ['Error', 'error'],
      ['Ready', 'ready'],
    ]) {
      await user.click(previewState.getByRole('button', {name: label}))
      expect(previewState.getByRole('button', {name: label})).toHaveAttribute('aria-pressed', 'true')
      expect(
        previewState.getAllByRole('button').filter(button => button.getAttribute('aria-pressed') === 'true'),
      ).toHaveLength(1)
      expect(screen.getByTestId('preview')).toHaveTextContent(`"previewState":"${value}"`)
      resetKey += 1
      expect(screen.getByTestId('preview')).toHaveTextContent(`"resetKey":${resetKey}`)
    }
    await user.selectOptions(screen.getByRole('combobox', {name: 'Recipe'}), 'inline')
    expect(container.getByRole('button', {name: 'Inline'})).toHaveAttribute('aria-pressed', 'true')
    expect(previewState.getByRole('button', {name: 'Ready'})).toHaveAttribute('aria-pressed', 'true')
    await user.click(container.getByRole('button', {name: 'Inline'}))
    await user.keyboard('{Tab}')
    expect(previewState.getByRole('button', {name: 'Ready'})).toHaveFocus()
    await user.keyboard('{Tab}')
    expect(previewState.getByRole('button', {name: 'Loading'})).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(previewState.getByRole('button', {name: 'Loading'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview')).toHaveTextContent('"previewState":"loading"')
  })

  it('copies the chosen source and explicitly reports clipboard failures', async () => {
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Permission denied'))
    render(<SelectPanelPlayground renderPreview={preview} skinSource=".Panel { color: black; }" />)
    await user.click(screen.getByRole('button', {name: 'Code'}))
    await user.click(screen.getByRole('button', {name: 'CSS'}))
    expect(screen.getByRole('button', {name: 'CSS'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":0')
    await user.click(screen.getByRole('button', {name: 'Copy CSS'}))
    expect(writeText).toHaveBeenCalledWith('.Panel { color: black; }')
    expect(screen.getByRole('status')).toHaveTextContent('Clipboard unavailable')
    writeText.mockResolvedValue(undefined)
    await user.click(screen.getByRole('button', {name: 'Copy CSS'}))
    expect(screen.getByRole('status')).toHaveTextContent('CSS copied.')
    await user.click(screen.getByRole('button', {name: 'React'}))
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    await user.click(screen.getByRole('button', {name: 'Copy example'}))
    expect(writeText).toHaveBeenLastCalledWith(screen.getByRole('region', {name: 'React example'}).textContent)
    expect(screen.getByRole('status')).toHaveTextContent('React example copied.')
    writeText.mockRestore()
  })

  it('switches inspector views without remounting the preview or changing its state', async () => {
    const user = userEvent.setup()
    render(
      <SelectPanelPlayground
        renderPreview={props => (
          <div>
            <input aria-label="Preview input" defaultValue="" />
            {preview(props)}
          </div>
        )}
      />,
    )
    const input = screen.getByRole('textbox', {name: 'Preview input'})
    await user.type(input, 'reforge')
    expect(screen.getByRole('complementary', {name: 'Composition'})).toBeVisible()

    await user.selectOptions(screen.getByRole('combobox', {name: 'Appearance'}), '2')
    expect(screen.getByRole('textbox', {name: 'Preview input'})).toBe(input)
    expect(input).toHaveValue('reforge')

    for (const name of ['Code', 'Composition']) {
      await user.click(screen.getByRole('button', {name}))
      expect(screen.getByRole('button', {name})).toHaveAttribute('aria-pressed', 'true')
      expect(screen.getByRole('complementary', {name})).toBeVisible()
      expect(screen.getByRole('textbox', {name: 'Preview input'})).toBe(input)
      expect(input).toHaveValue('reforge')
      expect(screen.getByTestId('preview')).toHaveTextContent('"resetKey":0')
      expect(screen.getByTestId('preview')).toHaveTextContent('"appearance":2')
    }
    expect(screen.queryByRole('region', {name: 'React example'})).not.toBeInTheDocument()
    expect(screen.queryByRole('slider')).not.toBeInTheDocument()
  })

  it('expands and restores the same preview, viewport, and inspector state', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} skinSource="/* demo styles */" />)
    const surface = screen.getByTestId('preview')
    await user.click(screen.getByRole('button', {name: 'Code'}))
    await user.click(screen.getByRole('button', {name: 'CSS'}))
    await user.click(screen.getByRole('button', {name: 'Mobile'}))
    const expand = screen.getByRole('button', {name: 'Expand preview'})
    await user.click(expand)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.queryByRole('group', {name: 'Playground views'})).not.toBeInTheDocument()
    expect(screen.getByTestId('preview')).toBe(surface)
    const restore = screen.getByRole('button', {name: 'Restore workspace'})
    expect(restore).toBe(expand)
    expect(restore).toHaveFocus()
    expect(restore).toHaveAttribute('aria-expanded', 'true')
    await user.click(restore)
    expect(screen.getByRole('complementary', {name: 'Code'})).toBeVisible()
    expect(screen.getByRole('button', {name: 'CSS'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', {name: 'Mobile'})).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByTestId('preview')).toBe(surface)
    expect(surface).toHaveTextContent('"resetKey":0')
    await user.click(screen.getByRole('button', {name: 'Reset preview'}))
    expect(surface).toHaveTextContent('"resetKey":1')
  })

  it('offers only React source when no stylesheet is provided', async () => {
    const user = userEvent.setup()
    render(<SelectPanelPlayground renderPreview={preview} />)
    await user.click(screen.getByRole('button', {name: 'Code'}))
    expect(screen.getByText('Read-only')).toBeVisible()
    expect(screen.queryByRole('button', {name: 'CSS'})).not.toBeInTheDocument()
    expect(screen.getByRole('region', {name: 'React example'})).toHaveTextContent('SelectPanel.Root')
  })
})

describe('SelectPanel playground demo', () => {
  it('uses native Primer input and option styling at the Primer stop', () => {
    const {container} = render(
      <ThemeProvider dayScheme="dark_dimmed">
        <SelectPanelDemo config={{...defaultConfig, presentation: 'inline'}} resetKey={0} />
        <BaseStyles>
          <SelectPanel.Root defaultSelected={['native']}>
            <SelectPanel.Content>
              <SelectPanel.SearchInput aria-label="Native search" />
              <SelectPanel.List aria-label="Native list">
                <SelectPanel.Item value="native">Native item</SelectPanel.Item>
              </SelectPanel.List>
            </SelectPanel.Content>
          </SelectPanel.Root>
        </BaseStyles>
      </ThemeProvider>,
    )
    const input = screen.getByRole('combobox', {name: 'Search repositories'}).parentElement!
    const nativeInput = screen.getByRole('combobox', {name: 'Native search'}).parentElement!
    for (const property of [
      'backgroundColor',
      'color',
      'borderRadius',
      'borderWidth',
      'marginLeft',
      'marginRight',
    ] as const) {
      expect(getComputedStyle(input)[property]).toBe(getComputedStyle(nativeInput)[property])
    }
    const item = screen.getByRole('option', {name: /copilot-app/})
    const nativeItem = screen.getByRole('option', {name: 'Native item'})
    for (const property of ['backgroundColor', 'color', 'borderRadius', 'fontSize'] as const) {
      expect(getComputedStyle(item)[property]).toBe(getComputedStyle(nativeItem)[property])
    }
    expect(container.querySelector('[style*="--playground-"]')).not.toBeInTheDocument()
  })

  it.each([0, 1, 1.5, 2, 2.5, 3, 4, 5])('keeps equal input side spacing at appearance %s', appearance => {
    render(<SelectPanelDemo config={{...defaultConfig, presentation: 'inline', appearance}} resetKey={0} />)
    const input = screen.getByRole('combobox', {name: 'Search repositories'}).parentElement!.getBoundingClientRect()
    const panel = screen.getByRole('listbox').parentElement!.getBoundingClientRect()
    const leftGap = input.left - panel.left
    const rightGap = panel.right - input.right
    expect(leftGap).toBeGreaterThanOrEqual(appearance === 2 ? 0 : 1)
    expect(Math.abs(leftGap - rightGap)).toBeLessThanOrEqual(0.75)
  })

  it('inherits the host theme while custom skins keep their own palette', () => {
    const config = {...defaultConfig, presentation: 'inline' as const}
    const renderThemed = (scheme: string, appearance: number) => (
      <ThemeProvider dayScheme={scheme}>
        <SelectPanelPlayground renderPreview={preview} />
        <SelectPanelDemo config={{...config, appearance}} resetKey={0} />
      </ThemeProvider>
    )
    const {rerender} = render(renderThemed('light', 0))
    const lightPage = getComputedStyle(screen.getByRole('main')).backgroundColor
    const lightInput = getComputedStyle(
      screen.getByRole('combobox', {name: 'Search repositories'}).parentElement!,
    ).backgroundColor
    rerender(renderThemed('dark_dimmed', 0))
    expect(getComputedStyle(screen.getByRole('main')).backgroundColor).not.toBe(lightPage)
    expect(
      getComputedStyle(screen.getByRole('combobox', {name: 'Search repositories'}).parentElement!).backgroundColor,
    ).not.toBe(lightInput)
    rerender(renderThemed('dark_dimmed', 2))
    const customBackground = getComputedStyle(
      screen.getByRole('combobox', {name: 'Search repositories'}).parentElement!,
    ).backgroundColor
    rerender(renderThemed('light', 2))
    expect(
      getComputedStyle(screen.getByRole('combobox', {name: 'Search repositories'}).parentElement!).backgroundColor,
    ).toBe(customBackground)
  })

  it.each([2, 2.5, 4, 5])('keeps selection and query when only the appearance changes to %s', async appearance => {
    const user = userEvent.setup()
    const config = {...defaultConfig, presentation: 'inline' as const, multiple: true}
    const {rerender} = render(<SelectPanelDemo config={config} resetKey={0} />)
    await user.click(screen.getByRole('option', {name: /reforge/}))
    await user.type(screen.getByRole('combobox', {name: 'Search repositories'}), 'TypeScript')
    rerender(<SelectPanelDemo config={{...config, appearance}} resetKey={0} />)
    expect(screen.getByRole('combobox', {name: 'Search repositories'})).toHaveValue('TypeScript')
    expect(screen.getByRole('option', {name: /reforge/})).toHaveAttribute('aria-selected', 'true')
    expect(screen.queryByRole('option', {name: /copilot-agent-runtime/})).not.toBeInTheDocument()
  })

  it('does not commit a draft until Save, and Cancel restores it', async () => {
    const user = userEvent.setup()
    const config = {...defaultConfig, presentation: 'inline' as const, multiple: true, commitMode: 'submit' as const}
    render(<SelectPanelDemo config={config} resetKey={0} />)
    const option = screen.getByRole('option', {name: /reforge/})
    await user.click(option)
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('copilot-app', {selector: 'p'})).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: 'Cancel'}))
    expect(option).toHaveAttribute('aria-selected', 'false')
    await user.click(option)
    await user.click(screen.getByRole('button', {name: 'Save'}))
    expect(screen.getByText('copilot-app, reforge', {selector: 'p'})).toBeInTheDocument()
  })

  it('omits the input for the quick-pick composition and resets only on request', async () => {
    const user = userEvent.setup()
    const config = {...presets[1].config, presentation: 'inline' as const}
    const {rerender} = render(<SelectPanelDemo config={config} resetKey={0} />)
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', {name: /reforge/}))
    rerender(<SelectPanelDemo config={config} resetKey={1} />)
    expect(screen.getByRole('option', {name: /copilot-app/})).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('option', {name: /reforge/})).toHaveAttribute('aria-selected', 'false')
  })
})
