import React from 'react'
import {render} from '@testing-library/react'
import {afterAll, describe, expect, it, vi} from 'vitest'
import {page, userEvent} from 'vitest/browser'
import axe from 'axe-core'
import BaseStyles from '../BaseStyles'
import {ThemeProvider} from '../ThemeProvider'
import {FeatureFlags} from '../FeatureFlags'
import {SelectPanel, type SelectPanelProps} from './SelectPanel'
// eslint-disable-next-line import/no-namespace -- Include new configured stories in the compatibility matrix.
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

function isStoryObject(
  value: unknown,
): value is {render: React.ComponentType<Record<string, unknown>>; args?: Record<string, unknown>} {
  return typeof value === 'object' && value !== null && 'render' in value && isStoryComponent(value.render)
}

function configured(children: React.ReactNode, enabled = true) {
  return (
    <ThemeProvider>
      <BaseStyles>
        <FeatureFlags flags={{primer_react_select_panel_composable_adapter: enabled}}>{children}</FeatureFlags>
      </BaseStyles>
    </ThemeProvider>
  )
}

afterAll(async () => {
  await page.viewport(1280, 720)
})

const storyGroups = [
  ['Default', defaultStories],
  ['Features', featureStories],
  ['Examples', exampleStories],
  ['Dev', devStories],
] as const

describe.each([1280, 390])('configured adapter at %ipx', width => {
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
        const {container} = render(configured(story))
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
          expect(collection.element().closest('[role="dialog"]')).not.toBeInstanceOf(HTMLDialogElement)
          await userEvent.keyboard('{Escape}')
          await expect.element(collection).not.toBeInTheDocument()
        }
      })
    }
  })
})

describe('configured adapter boundaries', () => {
  it('uses the original configured renderer when the flag is omitted', async () => {
    render(<defaultStories.Default />)
    await userEvent.click(page.getByRole('button', {name: /bug/}))
    await expect
      .element(page.getByTestId('filtered-action-list'))
      .toHaveAttribute('data-component', 'FilteredActionList')
  })

  it('does not change explicit composition', async () => {
    const onSelectedChange = vi.fn()
    render(
      configured(
        <SelectPanel.Root onSelectedChange={onSelectedChange}>
          <SelectPanel.SearchInput aria-label="Search" />
          <SelectPanel.List aria-label="Choices">
            <SelectPanel.Item value="one">One</SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Root>,
      ),
    )
    await userEvent.click(page.getByRole('option', {name: 'One', exact: true}))
    expect(onSelectedChange).toHaveBeenCalledExactlyOnceWith(['one'])
    expect(document.querySelector('[data-component="SelectPanel.Collection"]')).toBeNull()
  })

  it.each([
    {composable: false, stringId: '2'},
    {composable: true, stringId: '2'},
    {composable: true, stringId: '1'},
  ])('preserves filtered-out selection and item identity with %j', async ({composable, stringId}) => {
    const hidden = {id: 'hidden', text: 'Hidden selection'}
    const items = [{text: 'No ID'}, {id: 1, text: 'Numeric ID'}, {id: stringId, text: 'String ID'}]
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
    render(configured(<Example />, composable))
    for (const item of items) {
      await userEvent.click(page.getByRole('option', {name: item.text, exact: true}))
    }
    const selected = onSelectedChange.mock.lastCall?.[0]
    expect(selected).toHaveLength(4)
    for (const [index, item] of [hidden, ...items].entries()) expect(selected?.[index]).toBe(item)
    await userEvent.type(page.getByRole('combobox'), 'Numeric')
    await expect
      .element(page.getByRole('option', {name: 'Numeric ID', exact: true}))
      .toHaveAttribute('aria-selected', 'true')
  })

  it('honors canceled item actions for pointer and forwarded keyboard activation', async () => {
    const onSelectedChange = vi.fn()
    const onAction = vi.fn((_item, event: React.SyntheticEvent) => event.preventDefault())
    render(
      configured(
        <SelectPanel
          open
          onOpenChange={() => {}}
          items={[{id: 'one', text: 'One', onAction}]}
          selected={[]}
          onSelectedChange={onSelectedChange}
          onFilterChange={() => {}}
        />,
      ),
    )
    await userEvent.click(page.getByRole('option', {name: 'One', exact: true}))
    await userEvent.click(page.getByRole('combobox'))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    expect(onAction).toHaveBeenCalledTimes(2)
    expect(onSelectedChange).not.toHaveBeenCalled()
  })

  it('retains combobox relationships and has no detectable accessibility violations', async () => {
    render(configured(<featureStories.WithGroups />))
    await userEvent.click(page.getByRole('button', {name: /Select options/}))
    const input = page.getByRole('combobox')
    const list = page.getByRole('listbox')
    await expect.element(input).toHaveFocus()
    expect(input.element().getAttribute('aria-controls')).toBe(list.element().id)
    await userEvent.keyboard('{ArrowDown}')
    await expect.element(input).toHaveAttribute('aria-activedescendant')
    await expect.poll(() => getComputedStyle(page.getByRole('dialog').element()).opacity).toBe('1')
    const results = await axe.run(document.body, {
      runOnly: {type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']},
    })
    expect(results.violations).toEqual([])
  })
})
