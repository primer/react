import {render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import {axe} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionList} from '../ActionList'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider, SSRProvider} from '..'

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
})
