import React, {type JSX} from 'react'
import {describe, expect, it, vi} from 'vitest'
import {ActionList} from '../../ActionList'
import FormControl from '../../FormControl'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import data from './mock-story-data'
import type {SelectPanelProps} from './SelectPanel'
import {SelectPanel} from './SelectPanel'
import {implementsClassName} from '../../utils/testing'
import classes from './SelectPanel.module.css'

const Fixture = ({onSubmit, onCancel}: Pick<SelectPanelProps, 'onSubmit' | 'onCancel'>) => {
  const initialSelectedLabels = data.issue.labelIds // mock initial state: has selected labels
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  /* Selection */
  const onLabelSelect = (labelId: string) => {
    if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
    else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
  }

  const itemsToShow = data.labels

  return (
    <SelectPanel title="Select labels" onSubmit={onSubmit} onCancel={onCancel}>
      <SelectPanel.Button>Assign label</SelectPanel.Button>

      <ActionList>
        {itemsToShow.map(label => (
          <ActionList.Item
            key={label.id}
            onSelect={() => onLabelSelect(label.id)}
            selected={selectedLabelIds.includes(label.id)}
          >
            {label.name}
            <ActionList.Description variant="block">{label.description}</ActionList.Description>
          </ActionList.Item>
        ))}
      </ActionList>
      <SelectPanel.Footer />
    </SelectPanel>
  )
}

function SelectPanelWithinForm(): JSX.Element {
  return (
    <FormControl>
      <FormControl.Label>Select Panel Label</FormControl.Label>
      <Fixture />
    </FormControl>
  )
}

function SelectPanelWithComplexButtonWithinForm(): JSX.Element {
  return (
    <FormControl>
      <FormControl.Label>Select Panel Label</FormControl.Label>
      <SelectPanel title="Select labels" onSubmit={() => {}} onCancel={() => {}}>
        <SelectPanel.Button>
          <div>Assign label</div>
        </SelectPanel.Button>

        <ActionList>
          <ActionList.Item key={'Item'} onSelect={() => {}} selected={true}>
            Item
            <ActionList.Description variant="block">Item description</ActionList.Description>
          </ActionList.Item>
        </ActionList>
        <SelectPanel.Footer />
      </SelectPanel>
    </FormControl>
  )
}

describe('SelectPanel', () => {
  implementsClassName(SelectPanel, classes.Overlay)
  implementsClassName(SelectPanel.Header, classes.Header)
  implementsClassName(SelectPanel.SearchInput, classes.TextInput)
  it('renders Button by default', async () => {
    render(<Fixture />)

    const trigger = page.getByRole('button')
    await expect.element(trigger).toBeInTheDocument()
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens Dialog on Button click', async () => {
    render(<Fixture />)

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()

    const trigger = page.getByRole('button')
    await trigger.click()

    await expect.element(page.getByRole('dialog')).toBeInTheDocument()
  })

  type MockFunctions = {mockOnSubmit?: () => void; mockOnCancel?: () => void}
  const renderOpenFixture = async ({mockOnSubmit, mockOnCancel}: MockFunctions = {}) => {
    render(<Fixture onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    await page.getByRole('button').click()
  }

  it('clicking an item selects it', async () => {
    await renderOpenFixture()

    const initiallyUnselectedOption = page.getByRole('option').nth(2)
    await expect.element(initiallyUnselectedOption).toHaveAttribute('aria-selected', 'false')

    await initiallyUnselectedOption.click()
    await expect.element(initiallyUnselectedOption).toHaveAttribute('aria-selected', 'true')
  })

  const selectUnselectedOption = async () => {
    const initiallyUnselectedOption = page.getByRole('option').nth(2)
    await expect.element(initiallyUnselectedOption).toHaveAttribute('aria-selected', 'false')
    await initiallyUnselectedOption.click()
  }

  it('submit closes the dialog and calls onSubmit', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    await renderOpenFixture({mockOnSubmit, mockOnCancel})
    await selectUnselectedOption()

    const submitButton = page.getByRole('button', {name: 'Save'})
    await submitButton.click()

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).toHaveBeenCalledTimes(0)
  })

  it('cancel closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    await renderOpenFixture({mockOnSubmit, mockOnCancel})
    await selectUnselectedOption()

    const cancelButton = page.getByRole('button', {name: 'Cancel'})
    await cancelButton.click()

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })

  it('close button closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    await renderOpenFixture({mockOnSubmit, mockOnCancel})
    await selectUnselectedOption()

    const closeButton = page.getByRole('button', {name: 'Close'})
    await closeButton.click()

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })

  it('should not call addEventListener on each render for Escape key handling when onCancel has not changed', async () => {
    const onCancel = vi.fn()
    const container = render(
      <SelectPanel title="title" onCancel={onCancel}>
        child
      </SelectPanel>,
    )
    const addEventListenerSpy = vi.spyOn(globalThis.EventTarget.prototype, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(globalThis.EventTarget.prototype, 'removeEventListener')

    container.rerender(
      <SelectPanel title="title" onCancel={onCancel}>
        child
      </SelectPanel>,
    )
    expect(addEventListenerSpy).not.toHaveBeenCalled()
    expect(removeEventListenerSpy).not.toHaveBeenCalled()
  })

  it('Escape key closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    await renderOpenFixture({mockOnSubmit, mockOnCancel})
    await selectUnselectedOption()

    await userEvent.keyboard('{Escape}')

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })

  it('SelectPanel within FormControl should be labelled by FormControl.Label', async () => {
    render(<SelectPanelWithinForm />)
    const buttonByRole = page.getByRole('button')
    await expect.element(buttonByRole).toBeVisible()
    await expect.element(buttonByRole).toHaveAttribute('aria-label', 'Assign label, Select Panel Label')
  })

  it('SelectPanel with complex button within FormControl should be labelled by FormControl.Label', async () => {
    render(<SelectPanelWithComplexButtonWithinForm />)
    const buttonByRole = page.getByRole('button')
    await expect.element(buttonByRole).toBeVisible()
    await expect.element(buttonByRole).toHaveAttribute('aria-label', 'Assign label, Select Panel Label')
  })

  it('SelectPanel outside of FormControl should not be automatically assigned aria-label and aria-labelledby', async () => {
    render(<Fixture />)
    const buttonByRole = page.getByRole('button')
    await expect.element(buttonByRole).toBeVisible()
    await expect.element(buttonByRole).not.toHaveAttribute('aria-label', 'Assign label, Select Panel Label')
  })
})
