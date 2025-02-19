import {render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {ActionList} from '.'
import {BookIcon} from '@primer/octicons-react'
import {FeatureFlags} from '../FeatureFlags'

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
          role="option"
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
  it('should focus the button around the leading visual when tabbing to an inactive item', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const inactiveOptionButton = await waitFor(() => component.getByRole('button', {name: projects[3].inactiveText}))
    await userEvent.tab() // get focus on first element
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    expect(inactiveOptionButton).toHaveFocus()
  })
  it('should behave as inactive if both inactiveText and loading props are passed', async () => {
    const component = HTMLRender(<SingleSelectListStory />)
    const inactiveOptionButton = await waitFor(() => component.getByRole('button', {name: projects[5].inactiveText}))
    await userEvent.tab() // get focus on first element
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{ArrowDown}')
    expect(inactiveOptionButton).toHaveFocus()
  })
  it('should call onClick for a link item', async () => {
    const onClick = jest.fn()
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
  it('should render ActionList.Item as button when feature flag is enabled', async () => {
    const featureFlag = {
      primer_react_css_modules_staff: true,
      primer_react_css_modules_ga: true,
    }
    const {container} = HTMLRender(
      <FeatureFlags flags={featureFlag}>
        <ActionList>
          <ActionList.Item disabled={true}>Item 1</ActionList.Item>
          <ActionList.Item>Item 2</ActionList.Item>
        </ActionList>
      </FeatureFlags>,
    )
    const button = container.querySelector('button')
    expect(button).toHaveTextContent('Item 1')
    // Ensure passed prop "disabled" is applied to the button
    expect(button).toHaveAttribute('aria-disabled', 'true')
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })
  it('should render ActionList.Item as li when feature flag is disabled', async () => {
    const {container} = HTMLRender(
      <FeatureFlags
        flags={{
          primer_react_css_modules_staff: false,
          primer_react_css_modules_ga: false,
        }}
      >
        <ActionList>
          <ActionList.Item>Item 1</ActionList.Item>
          <ActionList.Item>Item 2</ActionList.Item>
        </ActionList>
      </FeatureFlags>,
    )
    const listitem = container.querySelector('li')
    const button = container.querySelector('button')
    expect(listitem).toHaveTextContent('Item 1')
    expect(listitem).toHaveAttribute('tabindex', '0')
    expect(button).toBeNull()
    const listItems = container.querySelectorAll('li')
    expect(listItems.length).toBe(2)
  })
  it('should apply ref to ActionList.Item when feature flag is disabled', async () => {
    const MockComponent = () => {
      const ref = React.useRef<HTMLLIElement>(null)
      const focusRef = () => {
        if (ref.current) ref.current.focus()
      }
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_staff: false,
            primer_react_css_modules_ga: false,
          }}
        >
          <button type="button" onClick={focusRef}>
            Prompt
          </button>
          <ActionList>
            <ActionList.Item ref={ref}>Item 1</ActionList.Item>
            <ActionList.Item>Item 2</ActionList.Item>
          </ActionList>
        </FeatureFlags>
      )
    }
    const {getByRole} = HTMLRender(<MockComponent />)
    const triggerBtn = getByRole('button', {name: 'Prompt'})
    const focusTarget = getByRole('listitem', {name: 'Item 1'})
    fireEvent.click(triggerBtn)
    expect(document.activeElement).toBe(focusTarget)
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
          <ActionList.TrailingAction icon={BookIcon} label="Action" />
        </ActionList.Item>
      </ActionList>,
    )
    const action = container.querySelector('button[aria-labelledby]')
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
    const onClick = jest.fn()
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
  it('should only trigger a key event once when feature flag is enabled', async () => {
    const mockOnSelect = jest.fn()
    const user = userEvent.setup()
    const {getByRole} = HTMLRender(
      <FeatureFlags
        flags={{
          primer_react_css_modules_staff: true,
          primer_react_css_modules_ga: true,
        }}
      >
        <ActionList>
          <ActionList.Item onSelect={mockOnSelect}>Item 1</ActionList.Item>
        </ActionList>
      </FeatureFlags>,
    )
    const item = getByRole('button')
    item.focus()
    expect(document.activeElement).toBe(item)
    await user.keyboard('{Enter}')
    expect(mockOnSelect).toHaveBeenCalledTimes(1)
  })
  it('should not render buttons when feature flag is enabled and is specified role', async () => {
    const {getByRole} = HTMLRender(
      <FeatureFlags
        flags={{
          primer_react_css_modules_staff: true,
          primer_react_css_modules_ga: true,
        }}
      >
        <ActionList>
          <ActionList.Item role="option">Item 1</ActionList.Item>
          <ActionList.Item role="menuitem">Item 2</ActionList.Item>
          <ActionList.Item role="menuitemcheckbox">Item 3</ActionList.Item>
          <ActionList.Item role="menuitemradio">Item 4</ActionList.Item>
          <ActionList.Item>Item 5</ActionList.Item>
        </ActionList>
      </FeatureFlags>,
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
})
