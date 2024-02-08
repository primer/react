import React from 'react'
import {ThemeProvider, ActionList} from '../../'
import {render, RenderResult} from '@testing-library/react'
import userEvent, {UserEvent} from '@testing-library/user-event'
import data from './stories/mock-data'
import {SelectPanel, SelectPanelProps} from './SelectPanel'

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
    <ThemeProvider>
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
    </ThemeProvider>
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
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    const submitButton = container.getByRole('button', {name: 'Save'})
    await user.click(submitButton)

    expect(container.queryByRole('dialog')).toBeNull()
    expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).toHaveBeenCalledTimes(0)
  })

  it('cancel closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    const cancelButton = container.getByRole('button', {name: 'Cancel'})
    await user.click(cancelButton)

    expect(container.queryByRole('dialog')).toBeNull()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })

  it('close button closes the dialog and calls onCancel', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()
    const {container, user} = await getFixtureWithOpenContainer({mockOnSubmit, mockOnCancel})
    selectUnselectedOption(container, user)

    const closeButton = container.getByRole('button', {name: 'Close'})
    await user.click(closeButton)

    expect(container.queryByRole('dialog')).toBeNull()
    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnSubmit).toHaveBeenCalledTimes(0)
  })
})
