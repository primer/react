import {describe, it, expect, vi} from 'vitest'
import {render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React, {type JSX} from 'react'
import {ActionList} from '.'
import {BookIcon} from '@primer/octicons-react'

function SimpleActionList(): JSX.Element {
  return (
    <ActionList>
      <ActionList.Item>New file</ActionList.Item>
      <ActionList.Divider />
      <ActionList.Item>Copy link</ActionList.Item>
      <ActionList.Item>Edit file</ActionList.Item>
      <ActionList.Item variant="danger">Delete file</ActionList.Item>
      <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="d">
        Link Item
      </ActionList.LinkItem>
      <ActionList.Item inactiveText="Unavailable due to an outage">Inactive item</ActionList.Item>
      <ActionList.Item inactiveText="Unavailable due to an outage" loading>
        Loading and inactive item
      </ActionList.Item>
    </ActionList>
  )
}

const projects = [
  {name: 'Primer Backlog', scope: 'GitHub'},
  {name: 'Primer React', scope: 'github/primer'},
  {name: 'Disabled Project', scope: 'github/primer', disabled: true},
  {name: 'Inactive Project', scope: 'github/primer', inactiveText: 'Unavailable due to an outage'},
  {name: 'Loading Project', scope: 'github/primer', loading: true},
  {
    name: 'Inactive and Loading Project',
    scope: 'github/primer',
    loading: true,
    inactiveText: 'Unavailable due to an outage, but loading still passed',
  },
]

function SingleSelectListStory(): JSX.Element {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  return (
    <ActionList selectionVariant="single" showDividers role="listbox" aria-label="Select a project">
      {projects.map((project, index) => (
        <ActionList.Item
          key={index}
          selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          disabled={project.disabled}
          inactiveText={project.inactiveText}
          loading={project.loading}
        >
          {project.name}
        </ActionList.Item>
      ))}
    </ActionList>
  )
}

describe('ActionList.Item', () => {
  it('should have aria-keyshortcuts applied to the correct element', async () => {
    const {container} = HTMLRender(<SimpleActionList />)
    const linkOptions = await waitFor(() => container.querySelectorAll('a'))
    expect(linkOptions[0]).toHaveAttribute('aria-keyshortcuts', 'd')
    expect(linkOptions[0].parentElement).not.toHaveAttribute('aria-keyshortcuts', 'd')
  })
  it('should fire onSelect on click and keypress', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const options = await waitFor(() => component.getAllByRole('option'))
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[1])
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
    // We pass keycode here to navigate a implementation detail in react-testing-library
    // https://github.com/testing-library/react-testing-library/issues/269#issuecomment-455854112
    fireEvent.keyPress(options[0], {key: 'Enter', charCode: 13})
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[1]).toHaveAttribute('aria-selected', 'false')
    fireEvent.keyPress(options[1], {key: ' ', charCode: 32})
    expect(options[0]).toHaveAttribute('aria-selected', 'false')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })
  it('should skip onSelect on disabled items', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const options = await waitFor(() => component.getAllByRole('option'))
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[2]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[2])
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[2]).toHaveAttribute('aria-selected', 'false')
    fireEvent.keyPress(options[2], {key: 'Enter', charCode: 13})
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[2]).toHaveAttribute('aria-selected', 'false')
  })
  it('should skip onSelect on inactive items', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const options = await waitFor(() => component.getAllByRole('option'))
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[3]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[3])
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[3]).toHaveAttribute('aria-selected', 'false')
    fireEvent.keyPress(options[3], {key: 'Enter', charCode: 13})
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[3]).toHaveAttribute('aria-selected', 'false')
  })
  it('should skip onSelect on loading items', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const options = await waitFor(() => component.getAllByRole('option'))
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[4]).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(options[4])
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[4]).toHaveAttribute('aria-selected', 'false')
    fireEvent.keyPress(options[3], {key: 'Enter', charCode: 13})
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    expect(options[4]).toHaveAttribute('aria-selected', 'false')
  })
  it('should not crash when clicking an item without an onSelect', async () => {
    const component = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Item role="option">Primer React</ActionList.Item>
      </ActionList>,
    )
    const option = await waitFor(() => component.getByRole('option'))
    expect(option).toBeInTheDocument()
    fireEvent.click(option)
    fireEvent.keyPress(option, {key: 'Enter', charCode: 13})
    expect(option).toBeInTheDocument()
  })
  it('should focus the button around the alert icon when tabbing to an inactive item', async () => {
    const component = HTMLRender(<SimpleActionList />)
    const inactiveIndicatorButton = await waitFor(() => component.getByRole('button', {name: 'Inactive item'}))
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab() // focuses 6th element, which is inactive
    expect(inactiveIndicatorButton).toHaveFocus()
    expect(document.activeElement).toHaveAccessibleDescription('Unavailable due to an outage')
  })
  it('should focus the option or menu item when moving focus to an inactive item **in a listbox**', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const inactiveOption = await waitFor(() => component.getByRole('option', {name: projects[3].name}))
    await userEvent.tab() // get focus on first element
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    expect(inactiveOption).toHaveFocus()
    expect(document.activeElement).toHaveAccessibleDescription(projects[3].inactiveText as string)
  })
  it('should behave as inactive if both inactiveText and loading props are passed', async () => {
    const component = HTMLRender(<SimpleActionList />)
    const inactiveIndicatorButton = await waitFor(() =>
      component.getByRole('button', {name: 'Loading and inactive item'}),
    )
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab()
    await userEvent.tab() // focuses 7th element, which is inactive AND has a loading prop
    expect(inactiveIndicatorButton).toHaveFocus()
    expect(document.activeElement).toHaveAccessibleDescription('Unavailable due to an outage')
  })

  it('should behave as inactive if both inactiveText and loading props are passed **in a listbox**', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const inactiveOption = await waitFor(() => component.getByRole('option', {name: projects[5].name}))
    await userEvent.tab() // get focus on first element
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    expect(inactiveOption).toHaveFocus()
    expect(document.activeElement).toHaveAccessibleDescription(projects[5].inactiveText as string)
  })
  it('should call onClick for a link item', async () => {
    const onClick = vi.fn()
    const component = HTMLRender(
      <ActionList role="listbox">
        <ActionList.LinkItem role="link" onClick={onClick}>
          Primer React
        </ActionList.LinkItem>
      </ActionList>,
    )
    const link = await waitFor(() => component.getByRole('link'))
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalled()
  })
  it('should render ActionList.Item as button', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item disabled={true}>Item 1</ActionList.Item>
        <ActionList.Item>Item 2</ActionList.Item>
      </ActionList>,
    )
    const button = container.querySelector('button')
    expect(button).toHaveTextContent('Item 1')
    // Ensure passed prop "disabled" is applied to the button
    expect(button).toHaveAttribute('aria-disabled', 'true')
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })
  it('should render ActionList.Item as li when item has proper aria role', async () => {
    const {container} = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Item role="option">Item 1</ActionList.Item>
        <ActionList.Item role="option">Item 2</ActionList.Item>
      </ActionList>,
    )
    const listitem = container.querySelector('li')
    const button = container.querySelector('button')
    expect(listitem).toHaveTextContent('Item 1')
    expect(listitem).toHaveAttribute('tabindex', '0')
    expect(button).toBeNull()
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })
  it('should render the trailing action as a button (default)', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction data-testid="trailing-action" icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    const action = container.querySelector('button[data-testid="trailing-action"]')
    expect(action).toHaveAccessibleName('Action')
  })
  it('should render the trailing action as a link', async () => {
    const {container} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction as="a" href="#" icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    const action = container.querySelector('a[href="#"][aria-labelledby]')
    expect(action).toHaveAccessibleName('Action')
  })
  it('should do action when trailing action is clicked', async () => {
    const onClick = vi.fn()
    const component = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction icon={BookIcon} label="Action" onClick={onClick} />
        </ActionList.Item>
      </ActionList>,
    )
    const trailingAction = await waitFor(() => component.getByRole('button', {name: 'Action'}))
    fireEvent.click(trailingAction)
    expect(onClick).toHaveBeenCalled()
  })
  it('should focus the trailing action', async () => {
    HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item 1
          <ActionList.TrailingAction icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    await userEvent.tab()
    expect(document.activeElement).toHaveTextContent('Item 1')
    await userEvent.tab()
    expect(document.activeElement).toHaveAccessibleName('Action')
  })
  it('should only trigger a key event once', async () => {
    const mockOnSelect = vi.fn()
    const user = userEvent.setup()
    const {getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Item onSelect={mockOnSelect}>Item 1</ActionList.Item>
      </ActionList>,
    )
    const item = getByRole('button')
    item.focus()
    expect(document.activeElement).toBe(item)
    await user.keyboard('{Enter}')
    expect(mockOnSelect).toHaveBeenCalledTimes(1)
  })
  it('should not render buttons when role is specified', async () => {
    const {getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Item role="option">Item 1</ActionList.Item>
        <ActionList.Item role="menuitem">Item 2</ActionList.Item>
        <ActionList.Item role="menuitemcheckbox">Item 3</ActionList.Item>
        <ActionList.Item role="menuitemradio">Item 4</ActionList.Item>
        <ActionList.Item>Item 5</ActionList.Item>
      </ActionList>,
    )
    const option = getByRole('option')
    expect(option.tagName).toBe('LI')
    expect(option.textContent).toBe('Item 1')
    const menuItem = getByRole('menuitem')
    expect(menuItem.tagName).toBe('LI')
    const menuItemCheckbox = getByRole('menuitemcheckbox')
    expect(menuItemCheckbox.tagName).toBe('LI')
    const menuItemRadio = getByRole('menuitemradio')
    expect(menuItemRadio.tagName).toBe('LI')
    const button = getByRole('button')
    expect(button.parentElement?.tagName).toBe('LI')
    expect(button.textContent).toBe('Item 5')
  })

  it('should add `role="option"` if `role="listbox"` and `selectionVariant` is present', async () => {
    const {getAllByRole} = HTMLRender(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item>Item 1</ActionList.Item>
        <ActionList.Item>Item 2</ActionList.Item>
        <ActionList.Item>Item 3</ActionList.Item>
        <ActionList.Item>Item 4</ActionList.Item>
      </ActionList>,
    )
    const options = getAllByRole('option')
    expect(options[0]).toBeInTheDocument()
    expect(options).toHaveLength(4)
  })

  it('should add `aria-describedby` to items with a description', () => {
    const {getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Item>
          Item, <ActionList.Description variant="block">Description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )
    const item = getByRole('button')
    expect(item).toHaveAttribute('aria-describedby')
    expect(item).toHaveTextContent('Item, Description')
    expect(item).toHaveAccessibleDescription('Description')
  })

  it('should add `aria-describedby` to items with a description when `role=listbox` is applied', () => {
    const {getByRole} = HTMLRender(
      <ActionList role="listbox" selectionVariant="single">
        <ActionList.Item>
          Item, <ActionList.Description variant="block">Description</ActionList.Description>
        </ActionList.Item>
      </ActionList>,
    )
    const item = getByRole('option')
    expect(item).toHaveAttribute('aria-describedby')
    expect(item).toHaveTextContent('Item, Description')
    expect(item).toHaveAccessibleDescription('Description')
  })
})
