import {cleanup, render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionMenu} from '../ActionMenu2'
import {ActionList} from '../ActionList2'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {BaseStyles, ThemeProvider, SSRProvider} from '..'
import '@testing-library/jest-dom'
expect.extend(toHaveNoViolations)

function SimpleActionMenu(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SSRProvider>
        <BaseStyles>
          <ActionMenu>
            <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item>New file</ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item>Copy link</ActionList.Item>
                <ActionList.Item>Edit file</ActionList.Item>
                <ActionList.Item variant="danger">Delete file</ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </BaseStyles>
      </SSRProvider>
    </ThemeProvider>
  )
}

describe('ActionMenu', () => {
  behavesAsComponent({
    Component: ActionList,
    options: {skipAs: true, skipSx: true},
    toRender: () => <SimpleActionMenu />
  })

  checkExports('ActionMenu2', {
    default: undefined,
    ActionMenu
  })

  it('should open Menu on MenuButton click', async () => {
    const component = HTMLRender(<SimpleActionMenu />)
    const button = component.getByText('Toggle Menu')
    fireEvent.click(button)
    expect(component.getByRole('menu')).toBeInTheDocument()
    cleanup()
  })

  it('should open Menu on MenuButton keypress', async () => {
    const component = HTMLRender(<SimpleActionMenu />)
    const button = component.getByText('Toggle Menu')

    // We pass keycode here to navigate a implementation detail in react-testing-library
    // https://github.com/testing-library/react-testing-library/issues/269#issuecomment-455854112
    fireEvent.keyDown(button, {key: 'Enter', charCode: 13})
    expect(component.getByRole('menu')).toBeInTheDocument()
    cleanup()
  })

  it('should close Menu on selecting an action with click', async () => {
    const component = HTMLRender(<SimpleActionMenu />)
    const button = component.getByText('Toggle Menu')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitem'))
    fireEvent.click(menuItems[0])
    expect(component.queryByRole('menu')).toBeNull()

    cleanup()
  })

  it('should close Menu on selecting an action with Enter', async () => {
    const component = HTMLRender(<SimpleActionMenu />)
    const button = component.getByText('Toggle Menu')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitem'))
    fireEvent.keyPress(menuItems[0], {key: 'Enter', charCode: 13})
    expect(component.queryByRole('menu')).toBeNull()

    cleanup()
  })

  it('should throw when selectionVariant is provided to ActionList within ActionMenu', async () => {
    // we expect console.error to be called, so we suppress that in the test
    const mockError = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    expect(() => {
      const component = HTMLRender(
        <ThemeProvider theme={theme}>
          <SSRProvider>
            <BaseStyles>
              <ActionMenu>
                <ActionMenu.Button>Toggle Menu</ActionMenu.Button>
                <ActionMenu.Overlay>
                  <ActionList selectionVariant="single">
                    <ActionList.Item selected={true}>Primer React</ActionList.Item>
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            </BaseStyles>
          </SSRProvider>
        </ThemeProvider>
      )

      const button = component.getByText('Toggle Menu')
      fireEvent.click(button)
    }).toThrow('ActionList cannot have a selectionVariant inside ActionMenu')

    cleanup()
    mockError.mockRestore()
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  checkStoriesForAxeViolations('ActionMenu2')
})
