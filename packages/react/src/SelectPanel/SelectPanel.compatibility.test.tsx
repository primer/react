import React from 'react'
import {act, render} from '@testing-library/react'
import {afterAll, afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import axe from 'axe-core'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
import {FeatureFlags} from '../FeatureFlags'
import {SelectPanel, type SelectPanelProps} from './SelectPanel'
import {Button} from '../Button'
// eslint-disable-next-line import/no-namespace -- Enumerate story exports so new configured examples are included automatically.
import * as defaultStories from './SelectPanel.stories'
// eslint-disable-next-line import/no-namespace
import * as featureStories from './SelectPanel.features.stories'
// eslint-disable-next-line import/no-namespace
import * as exampleStories from './SelectPanel.examples.stories'
// eslint-disable-next-line import/no-namespace
import * as devStories from './SelectPanel.dev.stories'

function isStoryComponent(value: unknown): value is React.ComponentType<Record<string, unknown>> {
  return typeof value === 'function'
}

function cancelItemAction(_item: unknown, event: React.SyntheticEvent) {
  event.preventDefault()
}

function cancelClick(event: React.MouseEvent) {
  event.preventDefault()
}

function isStoryObject(
  value: unknown,
): value is {render: React.ComponentType<Record<string, unknown>>; args?: Record<string, unknown>} {
  return typeof value === 'object' && value !== null && 'render' in value && isStoryComponent(value.render)
}

const storyGroups = [
  ['Default', defaultStories],
  ['Features', featureStories],
  ['Examples', exampleStories],
  ['Dev', devStories],
] as const

afterAll(async () => {
  await page.viewport(1280, 720)
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const platforms = [
  {dialog: false, invokers: false},
  {dialog: true, invokers: false},
  {dialog: true, invokers: true},
]

describe.each(platforms)('Configured adapter with $dialog dialog / $invokers invokers', flags => {
  describe.each([1280, 390])('at %ipx', width => {
    describe.each(storyGroups)('%s stories', (_group, stories) => {
      for (const [name, Story] of Object.entries(stories)) {
        if (name === 'default') continue
        it(`opens every configured panel in ${name} without falling back`, async () => {
          await page.viewport(width, 900)
          const story = isStoryComponent(Story)
            ? React.createElement(Story)
            : isStoryObject(Story)
              ? React.createElement(Story.render, Story.args)
              : undefined
          expect(story, `${name} must be a renderable configured story`).toBeDefined()
          const {container} = render(
            <ThemeProvider>
              <BaseStyles>
                <FeatureFlags
                  flags={{
                    primer_react_select_panel_composable_adapter: true,
                    primer_react_select_panel_native_dialog: flags.dialog,
                    primer_react_select_panel_native_invokers: flags.invokers,
                  }}
                >
                  {story}
                </FeatureFlags>
              </BaseStyles>
            </ThemeProvider>,
          )
          const triggers = Array.from(
            container.querySelectorAll<HTMLButtonElement>(
              name === 'WithExternalAnchor' ? 'button' : 'button[aria-haspopup]',
            ),
          )
          expect(triggers.length).toBeGreaterThan(0)
          for (const trigger of triggers) {
            await userEvent.click(trigger)
            const collection = page.getByTestId('filtered-action-list')
            await expect.element(collection).toHaveAttribute('data-component', 'SelectPanel.Collection')
            await expect.element(collection.getByRole('combobox')).toBeVisible()
            expect(document.querySelector('[data-component="FilteredActionList"]')).toBeNull()
            await userEvent.keyboard('{Escape}')
            await expect.element(collection).not.toBeInTheDocument()
          }
        })
      }
    })
  })
})

describe('Configured adapter compatibility boundaries', () => {
  it('does not change the explicit composition API', async () => {
    const onSelectedChange = vi.fn()
    render(
      <FeatureFlags flags={{primer_react_select_panel_composable_adapter: true}}>
        <SelectPanel.Root onSelectedChange={onSelectedChange}>
          <SelectPanel.SearchInput aria-label="Search" />
          <SelectPanel.List aria-label="Choices">
            <SelectPanel.Item value="one">One</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Root>
      </FeatureFlags>,
    )
    await expect.element(page.getByLabelText('Search', {exact: true})).toBeVisible()
    await userEvent.click(page.getByRole('option', {name: 'One'}))
    expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith(['one'])
    expect(document.querySelector('[data-component="SelectPanel.Collection"]')).toBeNull()
  })

  it('uses the original configured renderer when the flag is omitted', async () => {
    render(<defaultStories.Default />)
    await userEvent.click(page.getByRole('button', {name: /bug/}))
    await expect
      .element(page.getByTestId('filtered-action-list'))
      .toHaveAttribute('data-component', 'FilteredActionList')
  })

  // Only adapter keys distinguish numeric and string IDs with the same string representation.
  it.each([
    {composable: false, stringId: '2'},
    {composable: true, stringId: '2'},
    {composable: true, stringId: '1'},
  ])(
    'preserves item identity and filtered-out selections with adapter=$composable and string ID=$stringId',
    async ({composable, stringId}) => {
      const hidden = {id: 'hidden', text: 'Hidden selection'}
      const anonymous = {text: 'No ID'}
      const numeric = {id: 1, text: 'Numeric ID'}
      const string = {id: stringId, text: 'String ID'}
      const items = [anonymous, numeric, string]
      const onSelectedChange = vi.fn<(items: SelectPanelProps['items']) => void>()
      function Example() {
        const [selected, setSelected] = React.useState<SelectPanelProps['items']>([hidden])
        const [filter, setFilter] = React.useState('')
        return (
          <SelectPanel
            open
            onOpenChange={() => {}}
            selected={selected}
            onSelectedChange={(next: SelectPanelProps['items']) => {
              onSelectedChange(next)
              setSelected(next)
            }}
            items={items.filter(item => item.text.includes(filter))}
            onFilterChange={setFilter}
          />
        )
      }
      render(
        <FeatureFlags flags={{primer_react_select_panel_composable_adapter: composable}}>
          <Example />
        </FeatureFlags>,
      )
      for (const item of items) {
        await userEvent.click(page.getByRole('option', {name: item.text, exact: true}))
      }
      const selected = onSelectedChange.mock.lastCall?.[0]
      expect(selected).toHaveLength(4)
      for (const [index, item] of [hidden, ...items].entries()) {
        expect(selected?.[index]).toBe(item)
      }
      const input = page.getByRole('combobox')
      await userEvent.fill(input, 'Numeric')
      await userEvent.click(page.getByRole('option', {name: 'Numeric ID', exact: true}))
      expect(onSelectedChange).toHaveBeenLastCalledWith([hidden, anonymous, string])
      await userEvent.clear(input)
      await expect
        .element(page.getByRole('option', {name: 'No ID', exact: true}))
        .toHaveAttribute('aria-selected', 'true')
      await expect
        .element(page.getByRole('option', {name: 'String ID', exact: true}))
        .toHaveAttribute('aria-selected', 'true')
    },
  )

  it('allows item actions to cancel pointer and active-descendant keyboard selection', async () => {
    const onSelectedChange = vi.fn()
    const onAction = vi.fn(cancelItemAction)
    render(
      <FeatureFlags flags={{primer_react_select_panel_composable_adapter: true}}>
        <SelectPanel
          open
          onOpenChange={() => {}}
          items={[{id: 'one', text: 'One', onAction}]}
          selected={[]}
          onSelectedChange={onSelectedChange}
          onFilterChange={() => {}}
        />
      </FeatureFlags>,
    )
    await userEvent.click(page.getByRole('option', {name: 'One', exact: true}))
    await userEvent.click(page.getByRole('combobox'))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onAction).toHaveBeenCalledTimes(2)
    expect(onSelectedChange).not.toHaveBeenCalled()
    await expect.element(page.getByRole('option', {name: 'One', exact: true})).toHaveAttribute('aria-selected', 'false')
  })

  it('keeps native-host experiments off when the configured adapter is disabled', async () => {
    render(
      <FeatureFlags
        flags={{
          primer_react_select_panel_composable_adapter: false,
          primer_react_select_panel_native_dialog: true,
          primer_react_select_panel_native_invokers: true,
        }}
      >
        <defaultStories.Default />
      </FeatureFlags>,
    )
    await userEvent.click(page.getByRole('button', {name: /bug/}))
    expect(page.getByRole('dialog').element()).not.toBeInstanceOf(HTMLDialogElement)
    await expect
      .element(page.getByTestId('filtered-action-list'))
      .toHaveAttribute('data-component', 'FilteredActionList')
  })

  function configured(children: React.ReactNode, {adapter = true, dialog = true, invokers = false} = {}) {
    return (
      <ThemeProvider>
        <BaseStyles>
          <FeatureFlags
            flags={{
              primer_react_select_panel_composable_adapter: adapter,
              primer_react_select_panel_native_dialog: dialog,
              primer_react_select_panel_native_invokers: invokers,
            }}
          >
            {children}
          </FeatureFlags>
        </BaseStyles>
      </ThemeProvider>
    )
  }

  const choices = [{id: 1, text: 'One'}, {text: 'No ID'}, {id: 'disabled', text: 'Disabled', disabled: true}]
  const configuredTrigger = () => page.getByRole('button', {name: 'Choose', exact: true})
  const configuredSearch = () => page.getByRole('combobox', {name: 'Filter items', exact: true})

  describe.each([false, true])('Configured native compatibility with invokers=%s', invokers => {
    it.each(['anchored', 'modal'] as const)(
      'matches the composable %s backdrop without changing native modality or dismissal',
      async variant => {
        await page.viewport(1280, 900)
        const composed = render(
          configured(
            <SelectPanel.Root defaultOpen>
              <SelectPanel.Overlay variant={{regular: variant}}>
                <SelectPanel.Title>Choices</SelectPanel.Title>
                <SelectPanel.CloseButton />
              </SelectPanel.Overlay>
            </SelectPanel.Root>,
            {invokers},
          ),
        )
        const expectedBackdrop = getComputedStyle(page.getByRole('dialog').element(), '::backdrop').backgroundColor
        if (variant === 'anchored') expect(expectedBackdrop).toBe('rgba(0, 0, 0, 0)')
        else expect(expectedBackdrop).not.toBe('rgba(0, 0, 0, 0)')
        composed.unmount()

        const Example = variant === 'modal' ? featureStories.SingleSelectModal : defaultStories.Default
        render(configured(<Example />, {invokers}))
        const button = page.getByRole('button', {name: variant === 'modal' ? 'Select labels' : /bug/, exact: true})
        await userEvent.click(button)
        const host = page.getByRole('dialog').element()
        if (!(host instanceof HTMLDialogElement)) throw new Error('Expected the configured native dialog')
        expect(host.matches(':modal')).toBe(true)
        expect(getComputedStyle(host, '::backdrop').backgroundColor).toBe(expectedBackdrop)
        await userEvent.keyboard('{Escape}')
        await expect.poll(() => host.open).toBe(false)
        await expect.element(button).toHaveFocus()
      },
    )

    it('uses the shared modal host and preserves object identity and callback order', async () => {
      await page.viewport(1280, 900)
      const calls: unknown[] = []
      function Example() {
        const [open, setOpen] = React.useState(false)
        const [selected, setSelected] = React.useState<SelectPanelProps['items'][number]>()
        return (
          <SelectPanel
            open={open}
            onOpenChange={(value, reason) => {
              calls.push([value, reason])
              setOpen(value)
            }}
            selected={selected}
            onSelectedChange={(item: SelectPanelProps['items'][number] | undefined) => {
              calls.push(item)
              setSelected(item)
            }}
            items={choices}
            onFilterChange={() => {}}
            placeholder="Choose"
            renderAnchor={props => <Button {...props}>Choose</Button>}
          />
        )
      }
      render(configured(<Example />, {invokers}))
      const button = configuredTrigger()
      expect(button.element().hasAttribute('command')).toBe(invokers)
      const host = document.querySelector('dialog')
      expect(host).toBeInstanceOf(HTMLDialogElement)
      expect(document.querySelector('[data-component="SelectPanel.Collection"]')).toBeNull()
      await userEvent.click(button)
      await expect.poll(() => host?.matches(':modal')).toBe(true)
      await expect.element(configuredSearch()).toHaveFocus()
      await userEvent.click(page.getByRole('option', {name: 'No ID', exact: true}))
      await expect.poll(() => host?.open).toBe(false)
      expect(calls).toEqual([[true, 'anchor-click'], choices[1], [false, 'selection']])
      expect(calls[1]).toBe(choices[1])
      await expect.element(button).toHaveFocus()
      expect(document.querySelector('[data-component="SelectPanel.Collection"]')).toBeNull()
    })

    it('reconciles refused open, selection close, Escape, and native close commands', async () => {
      const onOpenChange = vi.fn()
      const onSelectedChange = vi.fn()
      const onCancel = vi.fn()
      const picker = (open: boolean) =>
        configured(
          <SelectPanel
            open={open}
            onOpenChange={onOpenChange}
            selected={undefined}
            onSelectedChange={onSelectedChange}
            onCancel={onCancel}
            variant="modal"
            items={choices}
            placeholder="Choose"
            onFilterChange={() => {}}
          />,
          {invokers},
        )
      const {rerender} = render(picker(false))
      await userEvent.click(configuredTrigger())
      await expect.poll(() => onOpenChange.mock.calls.length).toBe(1)
      const host = document.querySelector('dialog')
      await expect.poll(() => host?.open).toBe(false)
      rerender(picker(true))
      await expect.poll(() => host?.matches(':modal')).toBe(true)
      await userEvent.keyboard('{Escape}')
      expect(host?.matches(':modal')).toBe(true)
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')
      expect(onCancel).not.toHaveBeenCalled()
      await userEvent.click(page.getByRole('button', {name: 'Cancel and close', exact: true}))
      await expect.poll(() => onOpenChange.mock.calls.length).toBe(3)
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'cancel')
      expect(onCancel).toHaveBeenCalledOnce()
      await expect.poll(() => host?.matches(':modal')).toBe(true)
      await userEvent.click(page.getByRole('option', {name: 'No ID', exact: true}))
      expect(onSelectedChange).not.toHaveBeenCalled()
      await userEvent.click(page.getByRole('button', {name: 'Save', exact: true}))
      expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith(choices[1])
      expect(onOpenChange).toHaveBeenLastCalledWith(false, 'selection')
      expect(host?.matches(':modal')).toBe(true)
    })

    it('preserves single modal draft Save/Cancel and configured dismissal reasons', async () => {
      await page.viewport(1280, 900)
      const calls: unknown[] = []
      function Example() {
        const [open, setOpen] = React.useState(false)
        const [selected, setSelected] = React.useState<SelectPanelProps['items'][number] | undefined>(choices[0])
        return (
          <SelectPanel
            variant="modal"
            open={open}
            onOpenChange={(value, reason) => {
              calls.push([value, reason])
              setOpen(value)
            }}
            onCancel={() => calls.push('cancel')}
            selected={selected}
            onSelectedChange={(item: SelectPanelProps['items'][number] | undefined) => {
              calls.push(item)
              setSelected(item)
            }}
            onFilterChange={() => {}}
            renderAnchor={props => <Button {...props}>Choose</Button>}
            items={choices}
          />
        )
      }
      render(configured(<Example />, {invokers}))
      await userEvent.click(configuredTrigger())
      const host = document.querySelector('dialog')
      await userEvent.click(page.getByRole('option', {name: 'No ID', exact: true}))
      expect(calls).toEqual([[true, 'anchor-click']])
      expect(host?.matches(':modal')).toBe(true)
      await userEvent.click(page.getByRole('button', {name: 'Cancel', exact: true}))
      expect(calls).toEqual([[true, 'anchor-click'], 'cancel', [false, 'cancel']])
      await userEvent.click(configuredTrigger())
      await expect
        .element(page.getByRole('option', {name: 'One', exact: true}))
        .toHaveAttribute('aria-selected', 'true')
      await userEvent.click(page.getByRole('option', {name: 'No ID', exact: true}))
      await userEvent.click(page.getByRole('button', {name: 'Save', exact: true}))
      expect(calls.slice(-2)).toEqual([choices[1], [false, 'selection']])
      expect(calls[calls.length - 2]).toBe(choices[1])
      await expect.poll(() => host?.open).toBe(false)
      await userEvent.click(configuredTrigger())
      await userEvent.click(page.getByRole('dialog'), {position: {x: -10, y: -10}, force: true})
      expect(calls.slice(-2)).toEqual(['cancel', [false, 'click-outside']])
      await expect.poll(() => host?.open).toBe(false)
    })

    it('retains filtered-out multiple selections and skips disabled options', async () => {
      const hidden = {id: 'hidden', text: 'Hidden'}
      const onSelectedChange = vi.fn()
      function Example() {
        const [selected, setSelected] = React.useState<SelectPanelProps['items']>([hidden])
        return (
          <SelectPanel
            open
            onOpenChange={() => {}}
            selected={selected}
            onSelectedChange={(next: SelectPanelProps['items']) => {
              onSelectedChange(next)
              setSelected(next)
            }}
            items={choices}
            onFilterChange={() => {}}
          />
        )
      }
      render(configured(<Example />, {invokers}))
      await expect.element(configuredSearch()).toHaveFocus()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}')
      expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith([hidden, choices[0]])
      expect(onSelectedChange.mock.calls[0][0][0]).toBe(hidden)
      expect(onSelectedChange.mock.calls[0][0][1]).toBe(choices[0])
      expect(document.querySelector('dialog')?.matches(':modal')).toBe(true)
    })

    it('supports external anchors without injecting invoker behavior', async () => {
      render(configured(<featureStories.WithExternalAnchor />, {invokers}))
      const button = page.getByRole('button', {name: /bug/})
      expect(button.element()).not.toHaveAttribute('command')
      await userEvent.click(button)
      await expect.element(configuredSearch()).toHaveFocus()
      expect(document.querySelector('dialog')?.matches(':modal')).toBe(true)
      await userEvent.keyboard('{Escape}')
      await expect.element(button).toHaveFocus()
    })

    it('preserves configured widths, heights, surface props, refs and dismissal overrides', async () => {
      await page.viewport(1280, 900)
      const ref = React.createRef<HTMLDivElement>()
      const onEscape = vi.fn()
      const onClickOutside = vi.fn()
      render(
        configured(
          <SelectPanel
            open
            title="Choices"
            variant="modal"
            onCancel={() => {}}
            onOpenChange={() => {}}
            selected={[]}
            onSelectedChange={() => {}}
            items={Array.from({length: 100}, (_, id) => ({id, text: `Item ${id}`}))}
            onFilterChange={() => {}}
            width="large"
            height="medium"
            overlayProps={{
              ref,
              id: 'configured-native',
              'aria-label': 'Custom name',
              onEscape,
              onClickOutside,
              className: 'custom-surface',
              style: {borderWidth: 3},
              maxHeight: 'small',
            }}
          />,
          {invokers},
        ),
      )
      const dialog = page.getByRole('dialog', {name: 'Custom name', exact: true})
      await expect.element(configuredSearch()).toHaveFocus()
      expect(dialog.element()).toHaveAttribute('id', 'configured-native')
      expect(dialog.element()).toHaveAttribute('aria-modal', 'true')
      expect(ref.current).toHaveClass('custom-surface')
      expect(ref.current?.style.borderWidth).toBe('3px')
      expect(Math.round(ref.current?.getBoundingClientRect().width ?? 0)).toBe(480)
      expect(Math.round(ref.current?.getBoundingClientRect().height ?? 0)).toBe(256)
      const last = page.getByRole('option', {name: 'Item 99', exact: true})
      await userEvent.click(last)
      expect(last.element().getBoundingClientRect().bottom).toBeLessThanOrEqual(
        dialog.element().getBoundingClientRect().bottom,
      )
      await userEvent.keyboard('{Escape}')
      expect(onEscape).toHaveBeenCalledOnce()
      await userEvent.click(page.getByRole('dialog'), {position: {x: -10, y: -10}, force: true})
      expect(onClickOutside).toHaveBeenCalledOnce()
      expect(document.querySelector('dialog')?.matches(':modal')).toBe(true)
    })
  })

  describe('Configured native gates and fallbacks', () => {
    it('keeps a configured modal centered on narrow screens when fullscreen is disabled', async () => {
      await page.viewport(390, 844)
      render(
        <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
          {configured(
            <SelectPanel
              variant="modal"
              disableFullscreenOnNarrow
              open
              onOpenChange={() => {}}
              onCancel={() => {}}
              selected={undefined}
              onSelectedChange={() => {}}
              items={choices}
              onFilterChange={() => {}}
            />,
          )}
        </FeatureFlags>,
      )
      const dialog = page.getByRole('dialog')
      await expect.element(dialog).toHaveAttribute('data-variant', 'modal')
      await expect
        .poll(() => {
          const rect = dialog.element().getBoundingClientRect()
          return {x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2)}
        })
        .toEqual({x: 195, y: 422})
    })

    it('reconciles a refused responsive native close command without canceling the modal draft', async () => {
      await page.viewport(390, 844)
      const onOpenChange = vi.fn()
      const onCancel = vi.fn()
      const onSelectedChange = vi.fn()
      const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
      render(
        <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: true}}>
          {configured(
            <SelectPanel
              variant="modal"
              open
              onOpenChange={onOpenChange}
              onCancel={onCancel}
              selected={choices[0]}
              onSelectedChange={onSelectedChange}
              items={choices}
              onFilterChange={() => {}}
            />,
            {invokers: true},
          )}
        </FeatureFlags>,
      )
      const host = document.querySelector('dialog')
      const commands: string[] = []
      host?.addEventListener('command', event => {
        if (event instanceof CommandEvent && event.isTrusted) commands.push(event.command)
      })
      await userEvent.click(page.getByRole('option', {name: 'No ID', exact: true}))
      const close = page.getByRole('button', {name: 'Cancel and close', exact: true})
      await expect.element(close).toHaveAttribute('command', 'close')
      await userEvent.click(close)
      await expect.poll(() => onOpenChange.mock.calls.length).toBe(1)
      await expect.poll(() => host?.matches(':modal')).toBe(true)
      expect(commands).toEqual(['close'])
      expect(showModal).toHaveBeenCalledTimes(2)
      expect(onCancel).toHaveBeenCalledOnce()
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false, 'cancel')
      expect(onSelectedChange).not.toHaveBeenCalled()
      await expect
        .element(page.getByRole('option', {name: 'No ID', exact: true}))
        .toHaveAttribute('aria-selected', 'true')
    })

    it.each([
      {dialog: false, invokers: false},
      {dialog: false, invokers: true},
    ])('keeps the part-backed legacy host with $dialog dialog / $invokers invokers', async flags => {
      render(configured(<defaultStories.Default />, flags))
      await userEvent.click(page.getByRole('button', {name: /bug/}))
      expect(document.querySelector('dialog')).toBeNull()
      await expect
        .element(page.getByTestId('filtered-action-list'))
        .toHaveAttribute('data-component', 'SelectPanel.Collection')
    })

    it('falls back to the part-backed host without native dialog support', async () => {
      vi.stubGlobal('HTMLDialogElement', undefined)
      render(configured(<defaultStories.Default />, {invokers: true}))
      const button = page.getByRole('button', {name: /bug/})
      expect(button.element()).not.toHaveAttribute('command')
      await userEvent.click(button)
      expect(document.querySelector('dialog')).toBeNull()
      await expect
        .element(page.getByTestId('filtered-action-list'))
        .toHaveAttribute('data-component', 'SelectPanel.Collection')
    })

    it('retains native dialog with JavaScript controls without command support', async () => {
      vi.stubGlobal('CommandEvent', undefined)
      render(configured(<defaultStories.Default />, {invokers: true}))
      const button = page.getByRole('button', {name: /bug/})
      expect(button.element()).not.toHaveAttribute('command')
      await userEvent.click(button)
      expect(document.querySelector('dialog')?.matches(':modal')).toBe(true)
    })

    it.each([
      {height: 'initial' as const},
      {overlayProps: {height: 'initial' as const}},
      {overlayProps: {preventFocusOnOpen: true}},
      {overlayProps: {preventFocusOnClose: true}},
      {overlayProps: {top: 20}},
      {overlayProps: {style: {position: 'fixed' as const, top: 20}}},
      {overlayProps: {preventOverflow: false}},
      {overlayProps: {ignoreClickRefs: [React.createRef<HTMLElement>()]}},
      {cssAnchorPositioningSettings: {fallbackStrategy: 'none' as const}},
    ])('retains the legacy implementation for unsupported meaningful props: %j', async props => {
      render(
        configured(
          <SelectPanel
            {...props}
            open
            title="Choices"
            onOpenChange={() => {}}
            selected={[]}
            onSelectedChange={() => {}}
            items={choices}
            onFilterChange={() => {}}
          />,
          {invokers: true},
        ),
      )
      expect(document.querySelector('dialog')).toBeNull()
      await expect
        .element(page.getByTestId('filtered-action-list'))
        .toHaveAttribute('data-component', 'SelectPanel.Collection')
    })

    it.each([false, true])('keeps configured narrow defaults with fullscreen=%s', async fullscreen => {
      await page.viewport(390, 844)
      const overflow = document.body.style.overflow
      const {unmount} = render(
        <FeatureFlags flags={{primer_react_select_panel_fullscreen_on_narrow: fullscreen}}>
          {configured(<defaultStories.Default />, {invokers: true})}
        </FeatureFlags>,
      )
      await userEvent.click(page.getByRole('button', {name: /bug/}))
      const host = document.querySelector('dialog')
      expect(host?.matches(':modal')).toBe(true)
      expect(host).toHaveAttribute('data-variant', fullscreen ? 'fullscreen' : 'anchored')
      expect(getComputedStyle(page.getByRole('dialog').element(), '::backdrop').backgroundColor).toBe(
        'rgba(0, 0, 0, 0)',
      )
      if (fullscreen) expect(Math.round(host?.getBoundingClientRect().height ?? 0)).toBe(844)
      await expect.poll(() => document.body.style.overflow).toBe('hidden')
      unmount()
      expect(document.body.style.overflow).toBe(overflow)
    })

    it('preserves custom non-button anchors, keyboard reasons and canceled/disabled clicks', async () => {
      await page.viewport(1280, 900)
      const onOpenChange = vi.fn()
      const picker = (anchor: NonNullable<SelectPanelProps['renderAnchor']>) =>
        configured(
          <SelectPanel
            open={false}
            onOpenChange={onOpenChange}
            items={choices}
            selected={[]}
            onSelectedChange={() => {}}
            onFilterChange={() => {}}
            renderAnchor={anchor}
          />,
          {invokers: true},
        )
      const {rerender} = render(
        picker(props => (
          <button {...props} type="button" disabled>
            Choose
          </button>
        )),
      )
      act(() =>
        configuredTrigger()
          .element()
          .dispatchEvent(new MouseEvent('click', {bubbles: true})),
      )
      expect(onOpenChange).not.toHaveBeenCalled()
      rerender(
        picker(props => (
          <button {...props} type="button" onClick={cancelClick}>
            Choose
          </button>
        )),
      )
      await userEvent.click(configuredTrigger())
      expect(onOpenChange).not.toHaveBeenCalled()
      rerender(
        picker(props => (
          <a {...props} href="#picker">
            Choose
          </a>
        )),
      )
      const link = page.getByRole('link', {name: 'Choose', exact: true})
      expect(link.element()).not.toHaveAttribute('command')
      await userEvent.click(link)
      expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-click')
      act(() => link.element().focus())
      await userEvent.keyboard('{Enter}')
      expect(onOpenChange).toHaveBeenLastCalledWith(true, 'anchor-key-press')
    })
  })

  it.each(platforms)(
    'retains combobox semantics and passes accessibility checks with dialog=$dialog / invokers=$invokers',
    async flags => {
      render(
        <ThemeProvider>
          <BaseStyles>
            <FeatureFlags
              flags={{
                primer_react_select_panel_composable_adapter: true,
                primer_react_select_panel_native_dialog: flags.dialog,
                primer_react_select_panel_native_invokers: flags.invokers,
              }}
            >
              <featureStories.WithGroups />
            </FeatureFlags>
          </BaseStyles>
        </ThemeProvider>,
      )
      await userEvent.click(page.getByRole('button', {name: /Select options/}))
      const input = page.getByRole('combobox')
      const list = page.getByRole('listbox')
      await expect.element(input).toHaveFocus()
      expect(input.element().getAttribute('aria-controls')).toBe(list.element().id)
      await userEvent.keyboard('{ArrowDown}')
      await expect.element(input).toHaveAttribute('aria-activedescendant')
      // The native host is opaque immediately; its BaseOverlay surface owns
      // the entrance animation. Audit the settled colors, not the fade-in.
      const dialog = page.getByRole('dialog').element()
      const surface = dialog instanceof HTMLDialogElement ? dialog.firstElementChild : dialog
      if (!surface) throw new Error('Expected the visible configured panel surface')
      await expect.poll(() => getComputedStyle(surface).opacity).toBe('1')
      const results = await axe.run(document.body, {
        runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']},
      })
      expect(
        results.violations.map(({id, nodes}) => ({
          id,
          nodes: nodes.map(({html, failureSummary}) => ({html, failureSummary})),
        })),
      ).toEqual([])
    },
  )
})
