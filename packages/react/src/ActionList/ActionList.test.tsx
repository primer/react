import {render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import React from 'react'
import theme from '../theme'
import {ActionList} from '.'
import {BookIcon} from '@primer/octicons-react'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider, ActionMenu} from '..'
import {FeatureFlags} from '../FeatureFlags'

function SimpleActionList(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
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
      </BaseStyles>
    </ThemeProvider>
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

describe('ActionList', () => {
  behavesAsComponent({
    Component: ActionList,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionList />,
  })

  checkExports('ActionList', {
    default: undefined,
    ActionList,
  })

  it('should have aria-keyshortcuts applied to the correct element', async () => {
    const {container} = HTMLRender(<SimpleActionList />)

    const linkOptions = await waitFor(() => container.querySelectorAll('a'))

    expect(linkOptions[0]).toHaveAttribute('aria-keyshortcuts', 'd')
    expect(linkOptions[0].parentElement).not.toHaveAttribute('aria-keyshortcuts', 'd')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionList />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
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

  it('should throw when selected is provided without a selectionVariant on parent', async () => {
    // we expect console.error to be called, so we suppress that in the test
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    expect(() => {
      HTMLRender(
        <ActionList showDividers role="listbox" aria-label="Select a project">
          <ActionList.Item role="option" selected={true}>
            Primer React
          </ActionList.Item>
        </ActionList>,
      )
    }).toThrow('For Item to be selected, ActionList or ActionList.Group needs to have a selectionVariant defined')

    mockError.mockRestore()
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

  it('should render the ActionList.Heading component as a heading with the given heading level', async () => {
    const container = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
      </ActionList>,
    )
    const heading = container.getByRole('heading', {level: 1})
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Heading')
  })
  it('should label the action list with the heading id', async () => {
    const {container, getByRole} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Item>Item</ActionList.Item>
      </ActionList>,
    )
    const list = container.querySelector('ul')
    const heading = getByRole('heading', {level: 1})
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
  })
  it('should throw an error when ActionList.Heading is used within ActionMenu context', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    expect(() =>
      HTMLRender(
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <ActionMenu open={true}>
              <ActionMenu.Button>Trigger</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Heading as="h1">Heading</ActionList.Heading>
                  <ActionList.Item>Item</ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        </ThemeProvider>,
      ),
    ).toThrow(
      "ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.",
    )
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should throw an error when ActionList.GroupHeading has an `as` prop when it is used within ActionMenu context', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    expect(() =>
      HTMLRender(
        <ThemeProvider theme={theme}>
          <BaseStyles>
            <ActionMenu open={true}>
              <ActionMenu.Button>Trigger</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Group>
                    <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
                  </ActionList.Group>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </BaseStyles>
        </ThemeProvider>,
      ),
    ).toThrow(
      "Looks like you are trying to set a heading level to a menu role. Group headings for menu type action lists are for representational purposes, and rendered as divs. Therefore they don't need a heading level.",
    )
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should render the ActionList.GroupHeading component as a heading with the given heading level', async () => {
    const container = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const heading = container.getByRole('heading', {level: 2})
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Group Heading')
  })
  it('should throw an error if ActionList.GroupHeading is used without an `as` prop when no role is specified (for list role)', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    expect(() =>
      HTMLRender(
        <ActionList>
          <ActionList.Heading as="h1">Heading</ActionList.Heading>
          <ActionList.Group>
            <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
            <ActionList.Item>Item</ActionList.Item>
          </ActionList.Group>
        </ActionList>,
      ),
    ).toThrow(
      "You are setting a heading for a list, that requires a heading level. Please use 'as' prop to set a proper heading level.",
    )
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
  it('should render the ActionList.GroupHeading component as a span (not a heading tag) when role is specified as listbox', async () => {
    const container = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const label = container.getByText('Group Heading')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toEqual('SPAN')
  })
  it('should render the ActionList.GroupHeading component as a span with role="presentation" and aria-hidden="true" when role is specified as listbox', async () => {
    const container = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    const label = container.getByText('Group Heading')
    const wrapper = label.parentElement
    expect(wrapper).toHaveAttribute('role', 'presentation')
    expect(wrapper).toHaveAttribute('aria-hidden', 'true')
  })
  it('should label the list with the group heading id', async () => {
    const {container, getByText} = HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading as="h2">Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = getByText('Group Heading')
    expect(list).toHaveAttribute('aria-labelledby', heading.id)
  })
  it('should NOT label the list with the group heading id when role is specified', async () => {
    const {container, getByText} = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = getByText('Group Heading')
    expect(list).not.toHaveAttribute('aria-labelledby', heading.id)
  })
  it('should label the list using aria-label when role is specified', async () => {
    const {container, getByText} = HTMLRender(
      <ActionList role="listbox">
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group data-test-id="ActionList.Group">
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
          <ActionList.Item>Item</ActionList.Item>
        </ActionList.Group>
      </ActionList>,
    )
    const list = container.querySelector(`li[data-test-id='ActionList.Group'] > ul`)
    const heading = getByText('Group Heading')
    expect(list).toHaveAttribute('aria-label', heading.textContent)
  })

  it('should render ActionList.Item as button when feature flag is enabled', async () => {
    const featureFlag = {
      primer_react_action_list_item_as_button: true,
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
      <FeatureFlags flags={{primer_react_action_list_item_as_button: false}}>
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
        <FeatureFlags flags={{primer_react_action_list_item_as_button: false}}>
          <button onClick={focusRef}>Prompt</button>
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

  it('should render ActionList.Item as li when feature flag is enabled and has proper aria role', async () => {
    const {container} = HTMLRender(
      <FeatureFlags flags={{primer_react_action_list_item_as_button: true}}>
        <ActionList role="listbox">
          <ActionList.Item role="option">Item 1</ActionList.Item>
          <ActionList.Item role="option">Item 2</ActionList.Item>
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
      <FeatureFlags flags={{primer_react_action_list_item_as_button: true}}>
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

  it('should be navigatable with arrow keys for certain roles', async () => {
    HTMLRender(
      <ActionList role="listbox" aria-label="Select a project">
        <ActionList.Item role="option">Option 1</ActionList.Item>
        <ActionList.Item role="option">Option 2</ActionList.Item>
        <ActionList.Item role="option" disabled>
          Option 3
        </ActionList.Item>
        <ActionList.Item role="option">Option 4</ActionList.Item>
        <ActionList.Item role="option" inactiveText="Unavailable due to an outage">
          Option 5
        </ActionList.Item>
      </ActionList>,
    )

    await userEvent.tab() // tab into the story, this should focus on the first button
    expect(document.activeElement).toHaveTextContent('Option 1')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveTextContent('Option 2')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).not.toHaveTextContent('Option 3') // option 3 is disabled
    expect(document.activeElement).toHaveTextContent('Option 4')

    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement).toHaveAccessibleName('Unavailable due to an outage')

    await userEvent.keyboard('{ArrowUp}')
    expect(document.activeElement).toHaveTextContent('Option 4')
  })
})
