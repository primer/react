import React from 'react'
import {render} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import BaseStyles from '../../BaseStyles'
import {ThemeProvider} from '../../ThemeProvider'
import {FeatureFlags} from '../../FeatureFlags'
import {SelectPanel, type SelectPanelProps} from '../SelectPanel'
// eslint-disable-next-line import/no-namespace -- Exercise the same configured stories as the unchanged adapter suite.
import * as defaultStories from '../SelectPanel.stories'
// eslint-disable-next-line import/no-namespace
import * as featureStories from '../SelectPanel.features.stories'
// eslint-disable-next-line import/no-namespace
import * as exampleStories from '../SelectPanel.examples.stories'
// eslint-disable-next-line import/no-namespace
import * as devStories from '../SelectPanel.dev.stories'

function isStory(value: unknown): value is React.ComponentType<Record<string, unknown>> {
  return typeof value === 'function'
}

function isStoryObject(
  value: unknown,
): value is {render: React.ComponentType<Record<string, unknown>>; args?: Record<string, unknown>} {
  return typeof value === 'object' && value !== null && 'render' in value && isStory(value.render)
}

function fixture(children: React.ReactNode, adapter = true) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <FeatureFlags
          flags={{
            primer_react_select_panel_composable_adapter: adapter,
            primer_react_select_panel_native_dialog: true,
          }}
        >
          {children}
        </FeatureFlags>
      </BaseStyles>
    </ThemeProvider>
  )
}

afterEach(() => vi.restoreAllMocks())

const storyGroups = [
  ['Default', defaultStories],
  ['Features', featureStories],
  ['Examples', exampleStories],
  ['Dev', devStories],
] as const

describe.each([1280, 390])('configured native hosting at %ipx', width => {
  describe.each(storyGroups)('%s stories', (_group, stories) => {
    for (const [name, Story] of Object.entries(stories)) {
      if (name === 'default') continue
      it(`opens and dismisses every configured panel in ${name}`, async () => {
        await page.viewport(width, 900)
        const story = isStory(Story)
          ? React.createElement(Story)
          : isStoryObject(Story)
            ? React.createElement(Story.render, Story.args)
            : undefined
        expect(story).toBeDefined()
        const {container} = render(fixture(story))
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
          // Legacy Dialog nesting and meaningful compatibility options may
          // deliberately retain a non-native host; collection adoption does not.
          await userEvent.keyboard('{Escape}')
          await expect.element(collection).not.toBeInTheDocument()
        }
      })
    }
  })
})

const choices = [
  {id: 'one', text: 'One'},
  {id: 'two', text: 'Two'},
]

function Picker(props: Pick<SelectPanelProps, 'height' | 'overlayProps' | 'cssAnchorPositioningSettings'> = {}) {
  const [open, setOpen] = React.useState(false)
  return (
    <SelectPanel
      title="Configured choices"
      subtitle="Choose issue labels"
      placeholder="Select items"
      open={open}
      onOpenChange={setOpen}
      items={choices}
      selected={[]}
      onSelectedChange={() => {}}
      onFilterChange={() => {}}
      {...props}
    />
  )
}

it('does not adopt configured native hosting when the adapter flag is off', async () => {
  render(fixture(<defaultStories.Default />, false))
  await userEvent.click(page.getByRole('button', {name: /bug/}))
  expect(document.querySelector('dialog')).toBeNull()
  await expect.element(page.getByTestId('filtered-action-list')).toHaveAttribute('data-component', 'FilteredActionList')
})

it.each([
  {height: 'initial'},
  {overlayProps: {preventFocusOnOpen: true}},
  {overlayProps: {preventFocusOnClose: true}},
  {overlayProps: {preventOverflow: false}},
  {overlayProps: {style: {position: 'fixed'}}},
  {cssAnchorPositioningSettings: {fallbackStrategy: 'opposite-side'}},
] satisfies Partial<SelectPanelProps>[])(
  'keeps meaningful configured compatibility options on the existing host: %j',
  async props => {
    await page.viewport(1280, 900)
    render(fixture(<Picker {...props} />))
    await userEvent.click(page.getByRole('button', {name: 'Select items', exact: true}))
    expect(document.querySelector('dialog')).toBeNull()
    await expect
      .element(page.getByTestId('filtered-action-list'))
      .toHaveAttribute('data-component', 'SelectPanel.Collection')
  },
)

it('preserves configured component identifiers, forwarded surface props, refs and accessible naming', async () => {
  await page.viewport(1280, 900)
  const ref = React.createRef<HTMLDivElement>()
  render(
    fixture(
      <Picker
        overlayProps={{ref, id: 'native-configured-choices', className: 'native-configured-surface', width: 'large'}}
      />,
    ),
  )
  await userEvent.click(page.getByRole('button', {name: 'Select items', exact: true}))
  const host = page.getByRole('dialog', {name: 'Configured choices', exact: true}).element()
  expect(host).toBeInstanceOf(HTMLDialogElement)
  expect(host).toHaveAttribute('id', 'native-configured-choices')
  expect(host).toHaveAccessibleDescription('Choose issue labels')
  expect(ref.current).toBe(host.firstElementChild)
  expect(ref.current).toHaveClass('native-configured-surface')
  expect(ref.current?.getBoundingClientRect().width).toBe(480)
  expect(host.querySelector('[data-component="SelectPanel"]')).not.toBeNull()
  expect(host.querySelector('[data-component="SelectPanel.Subtitle"]')).toHaveTextContent('Choose issue labels')
})

it('keeps controlled modal rejection and draft cancellation authoritative', async () => {
  await page.viewport(1280, 900)
  const onOpenChange = vi.fn()
  const onCancel = vi.fn()
  const onSelectedChange = vi.fn()
  render(
    fixture(
      <SelectPanel
        variant="modal"
        onCancel={onCancel}
        title="Choose one"
        open
        onOpenChange={onOpenChange}
        items={choices}
        selected={choices[0]}
        onSelectedChange={onSelectedChange}
        onFilterChange={() => {}}
      />,
    ),
  )
  const host = page.getByRole('dialog', {name: 'Choose one', exact: true}).element()
  if (!(host instanceof HTMLDialogElement)) throw new Error('Expected native modal host')
  await expect.poll(() => host.matches(':modal')).toBe(true)
  await userEvent.click(page.getByRole('option', {name: 'Two', exact: true}))
  expect(onSelectedChange).not.toHaveBeenCalled()
  await userEvent.keyboard('{Escape}')
  expect(onOpenChange).toHaveBeenLastCalledWith(false, 'escape')
  expect(host.matches(':modal')).toBe(true)
  await expect.element(page.getByRole('option', {name: 'Two', exact: true})).toHaveAttribute('aria-selected', 'true')
  await userEvent.click(page.getByRole('button', {name: 'Save', exact: true}))
  expect(onSelectedChange).toHaveBeenCalledWith(choices[1])
  expect(onOpenChange).toHaveBeenLastCalledWith(false, 'selection')
  expect(host.matches(':modal')).toBe(true)
})
