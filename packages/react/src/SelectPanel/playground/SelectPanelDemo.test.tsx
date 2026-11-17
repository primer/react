import {act, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {page} from 'vitest/browser'
import {ThemeProvider} from '../../ThemeProvider'
import {SelectPanelDemo} from './SelectPanelDemo'
import {defaultConfig} from './model'

const secondaryActionSelector = '[data-component="SelectPanel.Item.SecondaryAction"]'

function getSecondaryAction(option: HTMLElement) {
  return option.querySelector<HTMLElement>(secondaryActionSelector)!
}

describe('SelectPanel demo footer and actions', () => {
  it.each([false, true])('shows trailing language text only without actions, actions=%s', async actions => {
    render(<SelectPanelDemo config={{...defaultConfig, actions, presentation: 'inline'}} resetKey={0} />)
    const list = page.getByRole('listbox', {name: 'Repositories'})
    if (actions) {
      await expect.element(list.getByText('TypeScript', {exact: true})).not.toBeInTheDocument()
      await expect.element(list.getByText('Rust', {exact: true})).not.toBeInTheDocument()
    } else {
      await expect.poll(() => list.getByText('TypeScript', {exact: true}).all().length).toBe(2)
      await expect.element(list.getByText('Rust', {exact: true})).toBeVisible()
    }
  })

  it.each([0, 1, 2, 3, 4, 5].flatMap(appearance => [false, true].map(actions => ({appearance, actions}))))(
    'uses checkmarks without persistent multi-selection fills at $appearance, actions=$actions',
    async config => {
      const user = userEvent.setup()
      render(
        <SelectPanelDemo config={{...defaultConfig, ...config, multiple: true, presentation: 'inline'}} resetKey={0} />,
      )
      const rows = screen.getAllByRole('option')
      const target = (row: HTMLElement) => row.querySelector<HTMLElement>(':scope > [data-size]')!
      await user.click(target(rows[1]))
      await user.unhover(target(rows[1]))
      await user.tab()
      const unselectedStyle = getComputedStyle(rows[2])
      for (const row of rows.slice(0, 2)) {
        expect(row).toHaveAttribute('aria-selected', 'true')
        expect(getComputedStyle(row).backgroundColor).toBe(unselectedStyle.backgroundColor)
        expect(getComputedStyle(row).color).toBe(unselectedStyle.color)
      }

      await user.hover(target(rows[1]))
      const selectedHover = {
        row: getComputedStyle(rows[1]).backgroundColor,
        target: getComputedStyle(target(rows[1])).backgroundColor,
        image: getComputedStyle(rows[1]).backgroundImage,
      }
      await user.hover(target(rows[2]))
      expect({
        row: getComputedStyle(rows[2]).backgroundColor,
        target: getComputedStyle(target(rows[2])).backgroundColor,
        image: getComputedStyle(rows[2]).backgroundImage,
      }).toEqual(selectedHover)
    },
  )

  it.each(['Escape', 'Close', 'Backdrop'] as const)(
    'dismisses a native details Dialog with %s without dismissing or selecting in the parent picker',
    async gesture => {
      const user = userEvent.setup()
      render(<SelectPanelDemo config={{...defaultConfig, actions: true, multiple: true}} resetKey={0} />)
      await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
      const option = screen.getByRole('option', {name: /copilot-tauri-app/})
      await user.click(option)
      expect(option).toHaveAttribute('aria-selected', 'false')
      await user.click(getSecondaryAction(option))
      const details = screen.getByRole('dialog', {name: 'copilot-tauri-app'})
      await user.click(within(details).getByText('Inspecting this repository does not select it.'))
      expect(screen.getByRole('dialog', {name: 'Choose repositories'})).toBeInTheDocument()
      if (gesture === 'Escape') await user.keyboard('{Escape}')
      else if (gesture === 'Close') await user.click(within(details).getByRole('button', {name: 'Close'}))
      else await user.click(details.parentElement!)
      expect(details).not.toBeInTheDocument()
      expect(screen.getByRole('dialog', {name: 'Choose repositories'})).toBeInTheDocument()
      expect(screen.getByRole('combobox', {name: 'Search repositories'})).toHaveFocus()
      expect(option).toHaveAttribute('aria-selected', 'false')
    },
  )

  it.each([
    {appearance: 0, actions: true},
    ...[1, 2, 3, 4, 5].flatMap(appearance => [false, true].map(actions => ({appearance, actions}))),
  ])('preserves single-selection fills at $appearance, actions=$actions', config => {
    render(<SelectPanelDemo config={{...defaultConfig, ...config, presentation: 'inline'}} resetKey={0} />)
    const rows = screen.getAllByRole('option')
    expect(rows[0]).toHaveAttribute('aria-selected', 'true')
    expect(getComputedStyle(rows[0]).backgroundColor).not.toBe(getComputedStyle(rows[1]).backgroundColor)
  })

  it.each([0, 1, 2, 3, 4, 5])('only gives copilot-tauri-app a trailing action at appearance %s', async appearance => {
    const user = userEvent.setup()
    render(
      <SelectPanelDemo config={{...defaultConfig, appearance, actions: true, presentation: 'inline'}} resetKey={0} />,
    )
    const list = screen.getByRole('listbox')
    expect(list.querySelectorAll(secondaryActionSelector)).toHaveLength(1)
    expect(getSecondaryAction(screen.getByRole('option', {name: /copilot-tauri-app/}))).toBeInTheDocument()
    const selection = screen.getByRole('option', {name: /reforge/})
    expect(selection.querySelector(secondaryActionSelector)).not.toBeInTheDocument()
    await user.click(selection)
    await user.keyboard('{Control>}{Shift>}u{/Shift}{/Control}')
    expect(screen.getByRole('combobox', {name: 'Search repositories'})).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('combobox', {name: 'Search repositories'})).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', {name: /copilot-agent-runtime/}).id,
    )

    const input = screen.getByRole('combobox', {name: 'Search repositories'})
    await user.type(input, 'Rust')
    expect(list.querySelectorAll(secondaryActionSelector)).toHaveLength(0)
    expect(screen.getByRole('option', {name: /copilot-agent-runtime/})).toBeInTheDocument()
    await user.clear(input)
    expect(list.querySelectorAll(secondaryActionSelector)).toHaveLength(1)
    expect(getSecondaryAction(screen.getByRole('option', {name: /copilot-tauri-app/}))).toBeInTheDocument()
  })

  it.each([0, 1, 2, 3, 4, 5])(
    'preserves grouped descriptions and active-result navigation without trailing metadata with actions at appearance %s',
    async appearance => {
      const user = userEvent.setup()
      render(
        <SelectPanelDemo
          config={{
            ...defaultConfig,
            appearance,
            actions: true,
            descriptions: true,
            grouped: true,
            multiple: true,
            presentation: 'inline',
          }}
          resetKey={0}
        />,
      )
      const first = screen.getByRole('option', {name: /copilot-tauri-app/})
      const second = screen.getByRole('option', {name: /reforge/})
      const last = screen.getByRole('option', {name: /copilot-agent-runtime/})
      expect(screen.queryByRole('grid')).not.toBeInTheDocument()
      expect(screen.getByRole('group', {name: 'Applications'})).toContainElement(first)
      expect(screen.getByRole('group', {name: 'Infrastructure'})).toContainElement(last)
      expect(within(first).getByText('A desktop home for your coding companion.')).toBeInTheDocument()
      expect(within(first).queryByText('TypeScript')).not.toBeInTheDocument()
      expect(getSecondaryAction(first)).toHaveAttribute('aria-hidden', 'true')

      const input = screen.getByRole('combobox', {name: 'Search repositories'})
      await user.click(input)
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute('aria-activedescendant', first.id)
      expect(first).toHaveAttribute('tabindex', '-1')
      expect(second).toHaveAttribute('tabindex', '-1')
      expect(last).toHaveAttribute('tabindex', '-1')
      await user.keyboard('{ArrowDown}')
      expect(input).toHaveAttribute('aria-activedescendant', second.id)
      expect(first).toHaveAttribute('tabindex', '-1')
      await user.keyboard('{Control>}{Shift>}u{/Shift}{/Control}')
      expect(input).toHaveFocus()
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      await user.keyboard('{ArrowDown}')
      expect(input).toHaveAttribute('aria-activedescendant', last.id)
      await user.keyboard('{ArrowDown}')
      expect(input).toHaveAttribute('aria-activedescendant', first.id)
    },
  )

  it.each([0, 1, 2, 3, 4, 5])(
    'opens pointer details without selecting the repository and restores search focus at appearance %s',
    async appearance => {
      const user = userEvent.setup()
      render(
        <SelectPanelDemo
          config={{...defaultConfig, appearance, actions: true, multiple: true, presentation: 'inline'}}
          resetKey={0}
        />,
      )
      const first = screen.getByRole('option', {name: /copilot-tauri-app/})
      await user.click(first)
      expect(first).toHaveAttribute('aria-selected', 'false')
      await user.click(getSecondaryAction(first))
      expect(screen.getByRole('dialog', {name: 'copilot-tauri-app'})).toBeInTheDocument()
      await user.click(screen.getByRole('button', {name: 'Back to repositories'}))
      expect(screen.getByRole('combobox', {name: 'Search repositories'})).toHaveFocus()
      expect(first).toHaveAttribute('aria-selected', 'false')
      expect(screen.getByText('Saved selection').parentElement).toHaveTextContent('No repositories selected')
    },
  )

  it.each([
    [4, 'rgb(105, 92, 74)'],
    [5, 'rgb(142, 188, 153)'],
  ] as const)('keeps loading, empty and error copy within the appearance %s palette', async (appearance, muted) => {
    const config = {...defaultConfig, appearance, presentation: 'inline' as const}
    const {rerender} = render(
      <ThemeProvider colorMode="night">
        <SelectPanelDemo config={{...config, previewState: 'loading'}} resetKey={0} />
      </ThemeProvider>,
    )
    expect(getComputedStyle(screen.getByText('Loading repositories')).color).toBe(muted)
    for (const previewState of ['empty', 'error'] as const) {
      await act(async () => {
        rerender(
          <ThemeProvider colorMode="night">
            <SelectPanelDemo config={{...config, previewState}} resetKey={0} />
          </ThemeProvider>,
        )
      })
      expect(getComputedStyle(screen.getByText(/This is a simulated/)).color).toBe(muted)
      expect(
        getComputedStyle(
          screen.getByText(previewState === 'empty' ? 'No repositories found' : 'Repositories could not be loaded'),
        ).color,
      ).toBe(muted)
    }
  })

  it.each([
    [4, 'Georgia', '3px', 'light', 'rgb(255, 252, 244)'],
    [5, 'Consolas', '0px', 'dark', 'rgb(18, 27, 22)'],
  ] as const)(
    'applies distinct materials and typography at appearance %s',
    (appearance, titleFont, radius, scheme, surface) => {
      render(
        <ThemeProvider colorMode="night">
          <SelectPanelDemo
            config={{...defaultConfig, appearance, multiple: true, presentation: 'inline', commitMode: 'submit'}}
            resetKey={0}
          />
        </ThemeProvider>,
      )
      const list = screen.getByRole('listbox')
      const panel = list.parentElement!
      const search = screen.getByRole('combobox').parentElement!
      const title = screen.getByText('Choose repositories')
      const indicator = screen
        .getByRole('option', {name: /reforge/})
        .querySelector('[data-component="ActionList.Selection"] > div')!
      expect(getComputedStyle(panel).borderRadius).toBe(radius)
      expect(getComputedStyle(panel).colorScheme).toBe(scheme)
      expect(getComputedStyle(list).backgroundColor).toBe(surface)
      expect(getComputedStyle(indicator).backgroundColor).toBe(surface)
      expect(getComputedStyle(title).fontFamily).toContain(titleFont)
      expect(getComputedStyle(search).borderTopWidth).toBe('1px')
      expect(getComputedStyle(search).borderTopColor === 'rgba(0, 0, 0, 0)').toBe(appearance === 4)
    },
  )

  it.each([
    [1, 'dark'],
    [1, 'dark_dimmed'],
    [1, 'dark_high_contrast'],
    [2, 'dark'],
    [2, 'dark_dimmed'],
    [2, 'dark_high_contrast'],
  ] as const)('uses white unchecked boxes at appearance %s under %s', async (appearance, nightScheme) => {
    const user = userEvent.setup()
    render(
      <ThemeProvider colorMode="night" nightScheme={nightScheme}>
        <SelectPanelDemo config={{...defaultConfig, appearance, multiple: true, presentation: 'inline'}} resetKey={0} />
      </ThemeProvider>,
    )
    const option = screen.getByRole('option', {name: /reforge/})
    const indicator = option.querySelector('[data-component="ActionList.Selection"] > div')!
    const selected = screen.getByRole('option', {name: /copilot-tauri-app/})
    const selectedIndicator = selected.querySelector('[data-component="ActionList.Selection"] > div')!
    expect(option).toHaveAttribute('aria-selected', 'false')
    expect(getComputedStyle(indicator).backgroundColor).toBe('rgb(255, 255, 255)')
    expect(getComputedStyle(indicator).borderTopWidth).toBe('1px')
    expect(getComputedStyle(indicator).borderTopColor).not.toBe('rgb(255, 255, 255)')
    expect(selected).toHaveAttribute('aria-selected', 'true')
    expect(getComputedStyle(selectedIndicator).backgroundColor).not.toBe('rgb(255, 255, 255)')

    await user.click(option)
    expect(option).toHaveAttribute('aria-selected', 'true')
    expect(getComputedStyle(indicator).backgroundColor).not.toBe('rgb(255, 255, 255)')
    await user.click(option)
    expect(option).toHaveAttribute('aria-selected', 'false')
    expect(getComputedStyle(indicator).backgroundColor).toBe('rgb(255, 255, 255)')
  })

  it.each([
    [4, 'rgb(83, 60, 37)', 'rgb(255, 252, 244)'],
    [5, 'rgb(138, 235, 154)', 'rgb(10, 28, 15)'],
  ] as const)('uses the appearance %s accent for checked boxes', (appearance, background, foreground) => {
    render(
      <SelectPanelDemo config={{...defaultConfig, appearance, multiple: true, presentation: 'inline'}} resetKey={0} />,
    )
    const indicator = screen
      .getByRole('option', {name: /copilot-tauri-app/})
      .querySelector('[data-component="ActionList.Selection"] > div')!
    expect(getComputedStyle(indicator).backgroundColor).toBe(background)
    expect(getComputedStyle(indicator, '::before').backgroundColor).toBe(foreground)
  })

  it.each([0, 2, 4])('keeps list and action-row typography and density aligned at appearance %s', appearance => {
    const config = {...defaultConfig, appearance, presentation: 'inline' as const}
    const {rerender} = render(<SelectPanelDemo config={config} resetKey={0} />)
    const option = screen.getByRole('option', {name: /copilot-tauri-app/})
    const label = within(option).getByText('copilot-tauri-app')
    const fontSize = getComputedStyle(label).fontSize
    const height = option.getBoundingClientRect().height
    expect(fontSize).toBe(appearance === 2 ? '13px' : '14px')
    expect(getComputedStyle(screen.getByRole('combobox')).fontSize).toBe(fontSize)

    rerender(<SelectPanelDemo config={{...config, actions: true}} resetKey={0} />)
    const selection = screen.getByRole('option', {name: /copilot-tauri-app/})
    expect(getComputedStyle(within(selection).getByText('copilot-tauri-app')).fontSize).toBe(fontSize)
    expect(selection.getBoundingClientRect().height).toBeCloseTo(height)
    expect(height).toBe(appearance === 2 ? 28 : 32)
    expect(getComputedStyle(screen.getByRole('combobox')).fontSize).toBe(fontSize)
  })

  it.each([0, 1, 4])('keeps modern body and description sizes with actions at appearance %s', appearance => {
    render(
      <SelectPanelDemo
        config={{...defaultConfig, appearance, actions: true, descriptions: true, presentation: 'inline'}}
        resetKey={0}
      />,
    )
    const option = screen.getByRole('option', {name: /copilot-tauri-app/})
    expect(getComputedStyle(within(option).getByText('copilot-tauri-app')).fontSize).toBe('14px')
    expect(getComputedStyle(screen.getByText('A desktop home for your coding companion.')).fontSize).toBe('12px')
    expect(getComputedStyle(screen.getByText('Choose the code you want to work with.')).fontSize).toBe('12px')
  })

  it('uses an integrated search strip, inset rows, compact label and shallow shadow only in the App skin', () => {
    const config = {...defaultConfig, appearance: 2, actions: true, presentation: 'inline' as const}
    const {rerender} = render(<SelectPanelDemo config={config} resetKey={0} />)
    const search = screen.getByRole('combobox').parentElement!
    const list = screen.getByRole('listbox')
    const panel = list.parentElement!
    const title = screen.getByText('Choose repositories')
    const searchStyle = getComputedStyle(search)
    expect(search.getBoundingClientRect().height).toBe(36)
    expect(search.getBoundingClientRect().left).toBe(panel.getBoundingClientRect().left)
    expect(search.getBoundingClientRect().right).toBe(panel.getBoundingClientRect().right)
    expect(searchStyle.borderTopWidth).toBe('0px')
    expect(searchStyle.borderLeftWidth).toBe('0px')
    expect(searchStyle.borderRightWidth).toBe('0px')
    expect(searchStyle.borderBottomWidth).toBe('1px')
    expect(getComputedStyle(panel).borderRadius).toBe('12px')
    expect(getComputedStyle(panel).gap).toBe('0px')
    expect(getComputedStyle(list).padding).toBe('4px')
    expect(getComputedStyle(title).fontSize).toBe('12px')
    expect(title.getBoundingClientRect().top).toBeGreaterThanOrEqual(search.getBoundingClientRect().bottom)
    expect(getComputedStyle(panel).boxShadow).toContain('6px 12px -3px')
    expect(getComputedStyle(panel).boxShadow).toContain('6px 18px 0px')
    const action = getSecondaryAction(screen.getByRole('option', {name: /copilot-tauri-app/}))
    expect(action.getBoundingClientRect().height).toBe(24)
    expect(action.getBoundingClientRect().width).toBe(24)

    for (const appearance of [0, 1, 3]) {
      rerender(<SelectPanelDemo config={{...config, appearance}} resetKey={0} />)
      const otherSearch = screen.getByRole('combobox').parentElement!
      expect(getComputedStyle(otherSearch).borderTopWidth).not.toBe('0px')
      expect(getComputedStyle(otherSearch).borderLeftWidth).not.toBe('0px')
      expect(getComputedStyle(otherSearch).borderRightWidth).not.toBe('0px')
      expect(screen.getByText('Choose repositories').getBoundingClientRect().top).toBeLessThan(
        otherSearch.getBoundingClientRect().top,
      )
    }
  })

  it.each([
    {presentation: 'anchored', width: 1000, rounded: true},
    {presentation: 'inline', width: 375, rounded: true},
    {presentation: 'modal', width: 1000, rounded: false},
    {presentation: 'anchored', width: 600, rounded: false},
  ] as const)(
    'matches the search focus corners to its position in $presentation at $width px',
    async ({presentation, width, rounded}) => {
      await page.viewport(width, 800)
      const user = userEvent.setup()
      render(<SelectPanelDemo config={{...defaultConfig, appearance: 2, presentation}} resetKey={0} />)
      if (presentation !== 'inline') await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
      const input = screen.getByRole('combobox', {name: 'Search repositories'})
      await user.click(input)
      expect(input).toHaveFocus()
      const search = input.parentElement!
      const style = getComputedStyle(search)
      expect(style.borderTopLeftRadius).toBe(
        rounded ? getComputedStyle(search.parentElement!).borderTopLeftRadius : '0px',
      )
      expect(style.borderTopRightRadius).toBe(
        rounded ? getComputedStyle(search.parentElement!).borderTopRightRadius : '0px',
      )
      expect(style.borderBottomLeftRadius).toBe('0px')
      expect(style.borderBottomRightRadius).toBe('0px')
      expect(style.outlineStyle).toBe('solid')
      expect(style.outlineWidth).toBe('2px')
      expect(style.outlineOffset).toBe('-2px')
    },
  )

  it.each([0, 1, 2, 3, 4, 5])(
    'keeps a medium picker width with or without actions at appearance %s',
    async appearance => {
      await page.viewport(1000, 800)
      const user = userEvent.setup()
      const config = {...defaultConfig, appearance}
      const {rerender} = render(<SelectPanelDemo config={config} resetKey={0} />)
      await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
      expect(getComputedStyle(screen.getByRole('dialog')).width).toBe('320px')
      rerender(<SelectPanelDemo config={{...config, actions: true}} resetKey={0} />)
      expect(getComputedStyle(screen.getByRole('dialog')).width).toBe('320px')
    },
  )

  it.each([0, 1, 2, 3, 4, 5])(
    'highlights the whole active item while search keeps focus at appearance %s',
    async appearance => {
      const user = userEvent.setup()
      render(<SelectPanelDemo config={{...defaultConfig, appearance, actions: true}} resetKey={0} />)
      await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
      await user.keyboard('{ArrowDown}{ArrowUp}')
      const row = screen.getByRole('option', {name: /copilot-tauri-app/})
      const action = getSecondaryAction(row)
      const input = screen.getByRole('combobox', {name: 'Search repositories'})
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute('aria-activedescendant', row.id)
      expect(row).toHaveAttribute('tabindex', '-1')
      expect(getComputedStyle(row).outlineStyle).toBe('solid')
      expect(getComputedStyle(action).outlineStyle).toBe('none')
      expect(action.getBoundingClientRect().right).toBeLessThanOrEqual(row.getBoundingClientRect().right)
      expect(action.getBoundingClientRect().left).toBeGreaterThanOrEqual(row.getBoundingClientRect().left)

      await user.keyboard('{Control>}{Shift>}u{/Shift}{/Control}')
      expect(screen.getByRole('dialog', {name: 'copilot-tauri-app'})).toBeInTheDocument()
      expect(action).not.toHaveFocus()

      await user.keyboard('{Escape}')
      expect(input).toHaveFocus()
      expect(getComputedStyle(row).outlineStyle).toBe('solid')
      expect(getComputedStyle(action).outlineStyle).toBe('none')
    },
  )

  it.each([0, 1, 2, 3, 4, 5])('groups small footer buttons and count at appearance %s', appearance => {
    render(
      <SelectPanelDemo
        config={{...defaultConfig, appearance, presentation: 'inline', multiple: true, commitMode: 'submit'}}
        resetKey={0}
      />,
    )
    const cancel = screen.getByRole('button', {name: 'Cancel'})
    const save = screen.getByRole('button', {name: 'Save'})
    const count = screen.getByText('1 selected')
    expect(cancel.parentElement).toBe(save.parentElement)
    expect(save.getBoundingClientRect().left - cancel.getBoundingClientRect().right).toBeCloseTo(8)
    expect(cancel).toHaveAttribute('data-size', 'small')
    expect(save).toHaveAttribute('data-size', 'small')
    expect(getComputedStyle(count).fontSize).toBe('12px')
    expect(count.getBoundingClientRect().right).toBeLessThan(cancel.getBoundingClientRect().left)
  })

  it.each([0, 1, 2, 3, 4, 5].flatMap(appearance => ['Control', 'Meta'].map(modifier => ({appearance, modifier}))))(
    'activates details directly with $modifier and restores search focus at appearance $appearance',
    async ({appearance, modifier}) => {
      const user = userEvent.setup()
      render(<SelectPanelDemo config={{...defaultConfig, appearance, actions: true, multiple: true}} resetKey={0} />)
      await user.click(screen.getByRole('button', {name: 'copilot-tauri-app'}))
      const selection = screen.getByRole('option', {name: /copilot-tauri-app/})
      const action = getSecondaryAction(selection)
      const input = screen.getByRole('combobox', {name: 'Search repositories'})
      expect(input).toHaveFocus()
      expect(input).toHaveAttribute('aria-activedescendant', selection.id)
      expect(action).toHaveAttribute('data-variant', 'invisible')
      expect(action).not.toHaveAttribute('tabindex')
      expect(action).toHaveAttribute('aria-hidden', 'true')
      expect(action.tagName).toBe('SPAN')
      expect(action).not.toHaveAttribute('role')
      expect(action).not.toHaveAttribute('aria-label')
      expect(action).toHaveAttribute('title', 'Details for copilot-tauri-app')
      expect(action.querySelector('svg')).not.toBeNull()
      expect(action.textContent).toBe('')
      await user.keyboard('{ArrowRight}')
      expect(input).toHaveFocus()

      await user.keyboard(`{${modifier}>}{Shift>}u{/Shift}{/${modifier}}`)
      const details = screen.getByRole('dialog', {name: 'copilot-tauri-app'})
      expect(details).not.toHaveAttribute('data-select-panel-part')
      expect(within(details).getByRole('button', {name: 'Close'})).toBeInTheDocument()
      expect(getComputedStyle(details).getPropertyValue('--playground-font-family')).toBe('')
      await user.click(screen.getByRole('button', {name: 'Back to repositories'}))
      expect(input).toHaveFocus()
      expect(screen.getByRole('dialog', {name: 'Choose repositories'})).toBeInTheDocument()
      expect(screen.getByText('Saved selection').parentElement).toHaveTextContent('copilot-tauri-app')
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    },
  )
})
