import {render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionList} from '.'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider, SSRProvider, ActionMenu} from '..'

function SimpleActionList(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
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
      </SSRProvider>
    </ThemeProvider>
  )
}

const projects = [
  {name: 'Primer Backlog', scope: 'GitHub'},
  {name: 'Primer React', scope: 'github/primer'},
  {name: 'Disabled Project', scope: 'github/primer', disabled: true},
  {name: 'Inactive Project', scope: 'github/primer', inactiveText: 'Unavailable due to an outage'},
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
          aria-selected={index === selectedIndex}
          onSelect={() => setSelectedIndex(index)}
          disabled={project.disabled}
          inactiveText={project.inactiveText}
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
    const results = await axe(container)
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
    const inactiveOptionButton = await waitFor(() =>
      component.getByRole('button', {description: projects[3].inactiveText}),
    )
    const inactiveIndex = projects.findIndex(project => 'inactiveText' in project)

    for (let i = 0; i < inactiveIndex; i++) {
      await userEvent.tab()
    }

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
          <SSRProvider>
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
          </SSRProvider>
        </ThemeProvider>,
      ),
    ).toThrow(
      "ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.",
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
  it('should throw a warning if ActionList.Group is used without as prop when no role is specified (for list role)', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementationOnce(() => {})

    HTMLRender(
      <ActionList>
        <ActionList.Heading as="h1">Heading</ActionList.Heading>
        <ActionList.Group>
          <ActionList.GroupHeading>Group Heading</ActionList.GroupHeading>
        </ActionList.Group>
      </ActionList>,
    )
    expect(spy).toHaveBeenCalledTimes(1)
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
})
