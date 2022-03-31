import {cleanup, render as HTMLRender, waitFor, fireEvent} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionMenu, ActionList, BaseStyles, ThemeProvider, SSRProvider} from '..'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {SingleSelection, MixedSelection} from '../stories/ActionMenu/examples.stories'
import '@testing-library/jest-dom'
expect.extend(toHaveNoViolations)

function Example(): JSX.Element {
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
                <ActionList.Item variant="danger" onClick={event => event.preventDefault()}>
                  Delete file
                </ActionList.Item>
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
    toRender: () => <Example />
  })

  checkExports('ActionMenu', {
    default: undefined,
    ActionMenu
  })

  it('should open Menu on MenuButton click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByText('Toggle Menu')
    fireEvent.click(button)
    expect(component.getByRole('menu')).toBeInTheDocument()
    cleanup()
  })

  it('should open Menu on MenuButton keypress', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByText('Toggle Menu')

    fireEvent.keyDown(button, {key: 'Enter'})
    expect(component.getByRole('menu')).toBeInTheDocument()
    cleanup()
  })

  it('should close Menu on selecting an action with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByText('Toggle Menu')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitem'))
    fireEvent.click(menuItems[0])
    expect(component.queryByRole('menu')).toBeNull()

    cleanup()
  })

  it('should close Menu on selecting an action with Enter', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByText('Toggle Menu')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitem'))

    // We pass keycode here to navigate a implementation detail in react-testing-library
    // https://github.com/testing-library/react-testing-library/issues/269#issuecomment-455854112
    fireEvent.keyPress(menuItems[0], {key: 'Enter', charCode: 13})
    expect(component.queryByRole('menu')).toBeNull()

    cleanup()
  })

  it('should not close Menu if event is prevented', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByText('Toggle Menu')

    fireEvent.click(button)
    const menuItems = await waitFor(() => component.getAllByRole('menuitem'))
    fireEvent.click(menuItems[3])
    // menu should still be open
    expect(component.getByRole('menu')).toBeInTheDocument()

    cleanup()
  })

  it('should be able to select an Item with selectionVariant', async () => {
    const component = HTMLRender(
      <ThemeProvider theme={theme}>
        <SingleSelection />
      </ThemeProvider>
    )
    const button = component.getByLabelText('Select field type')
    fireEvent.click(button)

    // select first item by role, that would close the menu
    fireEvent.click(component.getAllByRole('menuitemradio')[0])
    expect(component.queryByRole('menu')).not.toBeInTheDocument()

    // open menu again and check if the first option is checked
    fireEvent.click(button)
    expect(component.getAllByRole('menuitemradio')[0]).toHaveAttribute('aria-checked', 'true')
    cleanup()
  })

  it('should assign the right roles with groups & mixed selectionVariant', async () => {
    const component = HTMLRender(
      <ThemeProvider theme={theme}>
        <MixedSelection />
      </ThemeProvider>
    )
    const button = component.getByLabelText('Select field type to group by')
    fireEvent.click(button)

    expect(component.getByLabelText('Status')).toHaveAttribute('role', 'menuitemradio')
    expect(component.getByLabelText('Clear Group by')).toHaveAttribute('role', 'menuitem')

    cleanup()
  })

  it('should keep focus on Button when menu is opened with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    userEvent.tab() // tab into the story, this should focus on the first button
    expect(button).toEqual(document.activeElement) // trust, but verify

    fireEvent.click(button)
    expect(component.queryByRole('menu')).toBeInTheDocument()

    /** We use waitFor because the hook uses an effect with setTimeout
     *  and we need to wait for that to happen in the next tick
     */
    await waitFor(() => expect(document.activeElement).toEqual(button))

    cleanup()
  })

  it('should select first element when ArrowDown is pressed after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)

    const button = component.getByText('Toggle Menu')
    button.focus() // browsers do this automatically on click, but tests don't
    fireEvent.click(button)
    expect(component.queryByRole('menu')).toBeInTheDocument()

    // button should be the active element
    fireEvent.keyDown(document.activeElement!, {key: 'ArrowDown', code: 'ArrowDown'})

    await waitFor(() => {
      expect(component.getAllByRole('menuitem')[0]).toEqual(document.activeElement)
    })

    cleanup()
  })

  it('should select last element when ArrowUp is pressed after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)

    const button = component.getByText('Toggle Menu')
    button.focus() // browsers do this automatically on click, but tests don't
    fireEvent.click(button)
    expect(component.queryByRole('menu')).toBeInTheDocument()

    // button should be the active element
    fireEvent.keyDown(document.activeElement!, {key: 'ArrowUp', code: 'ArrowUp'})

    await waitFor(() => {
      expect(component.getAllByRole('menuitem').pop()).toEqual(document.activeElement)
    })

    cleanup()
  })

  it('should close the menu if Tab is pressed and move to next element', async () => {
    const component = HTMLRender(
      <>
        <Example />
        <input type="text" placeholder="next focusable element" />
      </>
    )
    const anchor = component.getByRole('button')

    userEvent.tab() // tab into the story, this should focus on the first button
    expect(anchor).toEqual(document.activeElement) // trust, but verify

    fireEvent.keyDown(anchor, {key: 'Enter'})
    expect(component.queryByRole('menu')).toBeInTheDocument()

    expect(component.getAllByRole('menuitem')[0]).toEqual(document.activeElement)

    await waitFor(() => {
      userEvent.tab()
      expect(document.activeElement).toEqual(component.getByPlaceholderText('next focusable element'))
      expect(component.queryByRole('menu')).not.toBeInTheDocument()
    })

    cleanup()
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Example />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  checkStoriesForAxeViolations('ActionMenu/fixtures')
  checkStoriesForAxeViolations('ActionMenu/examples')
})
