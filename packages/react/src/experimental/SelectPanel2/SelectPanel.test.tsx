import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {ActionList, FormControl} from '../../'
import type {RenderResult} from '@testing-library/react'
import {render} from '@testing-library/react'
import type {UserEvent} from '@testing-library/user-event'
import userEvent from '@testing-library/user-event'
import data from './mock-story-data'
import type {SelectPanelProps} from './SelectPanel'
import {SelectPanel} from './SelectPanel'

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
  it('renders Button by default', async () => {
    const container = render(<Fixture />)

    const trigger = container.getByRole('button')
    expect(trigger).toBeInTheDocument()
    expect(container.queryByRole('dialog')).toBeNull()
  })

  it('opens Dialog on Button click', async () => {
    const container = render(<Fixture />)
    const user = userEvent.setup()

    expect(container.queryByRole('dialog')).toBeNull()

    const trigger = container.getByRole('button')
    await user.click(trigger)

    expect(container.queryByRole('dialog')).toBeInTheDocument()
  })

  type MockFunctions = {mockOnSubmit?: () => void; mockOnCancel?: () => void}
  const getFixtureWithOpenContainer = async ({mockOnSubmit, mockOnCancel}: MockFunctions = {}) => {
    const container = render(<Fixture onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    const user = await userEvent.setup()

    const trigger = container.getByRole('button')
    await user.click(trigger)

    return {container, user}
  }

  it('clicking an item selects it', async () => {
    const {container, user} = await getFixtureWithOpenContainer()

    const initiallyUnselectedOption = container.getAllByRole('option')[2]
    expect(initiallyUnselectedOption).toHaveAttribute('aria-selected', 'false')

    await user.click(initiallyUnselectedOption)
    expect(initiallyUnselectedOption).toHaveAttribute('aria-selected', 'true')
  })

  const selectUnselectedOption = async (container: RenderResult, user: UserEvent) => {
    const initiallyUnselectedOption = container.getAllByRole('option')[2]
    expect(initiallyUnselectedOption).toHaveAttribute('aria-selected', 'false')
    await user.click(initiallyUnselectedOption)
  }

  it('submit closes the dialog and calls onSubmit', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    const submitButton = container.getByRole('button', {name: 'Save'})
    await user.click(submitButton)

    expect(container.queryByRole('dialog')).toBeNull()
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).toHaveBeenCalledTimes(0)
  })

  it('cancel closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    const cancelButton = container.getByRole('button', {name: 'Cancel'})
    await user.click(cancelButton)

    expect(container.queryByRole('dialog')).toBeNull()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })

  it('close button closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = vi.fn()
    const mockOnCancel = vi.fn()
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    const closeButton = container.getByRole('button', {name: 'Close'})
    await user.click(closeButton)

    expect(container.queryByRole('dialog')).toBeNull()
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
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    await user.keyboard('{Escape}')

    expect(container.queryByRole('dialog')).toBeNull()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })

  it('SelectPanel within FormControl should be labelled by FormControl.Label', async () => {
    const component = render(<SelectPanelWithinForm />)
    const buttonByRole = component.getByRole('button')
    expect(buttonByRole).toBeVisible()
    expect(buttonByRole).toHaveAttribute('aria-label', 'Assign label, Select Panel Label')
  })

  it('SelectPanel with complex button within FormControl should be labelled by FormControl.Label', async () => {
    const component = render(<SelectPanelWithComplexButtonWithinForm />)
    const buttonByRole = component.getByRole('button')
    expect(buttonByRole).toBeVisible()
    expect(buttonByRole).toHaveAttribute('aria-label', 'Assign label, Select Panel Label')
  })

  it('SelectPanel outside of FormControl should not be automatically assigned aria-label and aria-labelledby', async () => {
    const component = render(<Fixture />)
    const buttonByRole = component.getByRole('button')
    expect(buttonByRole).toBeVisible()
    expect(buttonByRole).not.toHaveAttribute('aria-label', 'Assign label, Select Panel Label')
  })
})
