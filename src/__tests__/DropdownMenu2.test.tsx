import {cleanup, render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import 'babel-polyfill'
import {toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {DropdownMenu} from '../DropdownMenu2'
import {ActionList} from '../ActionList2'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {BaseStyles, ThemeProvider, SSRProvider} from '..'
import '@testing-library/jest-dom'
expect.extend(toHaveNoViolations)

function SimpleDropdownMenu(): JSX.Element {
  const fieldTypes = [{name: 'Text'}, {name: 'Number'}, {name: 'Date'}, {name: 'Single select'}, {name: 'Iteration'}]
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const selectedType = fieldTypes[selectedIndex]

  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          <DropdownMenu>
            <DropdownMenu.Button aria-label="Select field type">{selectedType.name}</DropdownMenu.Button>
            <DropdownMenu.Overlay width="medium">
              <ActionList selectionVariant="single">
                {fieldTypes.map((type, index) => (
                  <ActionList.Item
                    key={index}
                    selected={index === selectedIndex}
                    onSelect={() => setSelectedIndex(index)}
                  >
                    {type.name}
                  </ActionList.Item>
                ))}
              </ActionList>
            </DropdownMenu.Overlay>
          </DropdownMenu>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('DropdownMenu', () => {
  behavesAsComponent({
    Component: ActionList,
    options: {skipAs: true, skipSx: true},
    toRender: () => <SimpleDropdownMenu />
  })

  checkExports('DropdownMenu2', {
    default: undefined,
    DropdownMenu
  })

  it('should open Menu on Button click', async () => {
    const component = HTMLRender(<SimpleDropdownMenu />)
    const button = component.getByLabelText('Select field type')
    fireEvent.click(button)
    expect(component.getByRole('menu')).toBeInTheDocument()
    cleanup()
  })

  it('should open Menu on Button keypress', async () => {
    const component = HTMLRender(<SimpleDropdownMenu />)
    const button = component.getByLabelText('Select field type')

    // We pass keycode here to navigate a implementation detail in react-testing-library
    // https://github.com/testing-library/react-testing-library/issues/269#issuecomment-455854112
    fireEvent.keyDown(button, {key: 'Enter', charCode: 13})
    expect(component.getByRole('menu')).toBeInTheDocument()
    cleanup()
  })

  it('should close Menu on selecting an action with click', async () => {
    const component = HTMLRender(<SimpleDropdownMenu />)
    const button = component.getByLabelText('Select field type')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitemradio'))
    fireEvent.click(menuItems[0])
    expect(component.queryByRole('menu')).toBeNull()

    cleanup()
  })

  it('should close Menu on selecting an action with Enter', async () => {
    const component = HTMLRender(<SimpleDropdownMenu />)
    const button = component.getByLabelText('Select field type')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitemradio'))
    fireEvent.keyPress(menuItems[0], {key: 'Enter', charCode: 13})
    expect(component.queryByRole('menu')).toBeNull()

    cleanup()
  })

  it('should throw when selectionVariant=multiple is provided to ActionList within DropdownMenu', async () => {
    // we expect console.error to be called, so we suppress that in the test
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    expect(() => {
      const component = HTMLRender(
        <ThemeProvider theme={theme}>
          <SSRProvider>
            <BaseStyles>
              <DropdownMenu>
                <DropdownMenu.Button>Select a field</DropdownMenu.Button>
                <DropdownMenu.Overlay>
                  <ActionList selectionVariant="multiple">
                    <ActionList.Item selected={true}>Primer React</ActionList.Item>
                  </ActionList>
                </DropdownMenu.Overlay>
              </DropdownMenu>
            </BaseStyles>
          </SSRProvider>
        </ThemeProvider>
      )

      const button = component.getByText('Select a field')
      fireEvent.click(button)
    }).toThrow('selectionVariant multiple cannot be used in DropdownMenu')

    cleanup()
    mockError.mockRestore()
  })

  checkStoriesForAxeViolations('DropdownMenu2/fixtures')
  checkStoriesForAxeViolations('DropdownMenu2/examples')
})
