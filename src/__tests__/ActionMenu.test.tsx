import {render as HTMLRender, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionMenu, ActionList, BaseStyles, ThemeProvider, SSRProvider} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {SingleSelect} from '../ActionMenu/ActionMenu.features.stories'
import {MixedSelection} from '../ActionMenu/ActionMenu.examples.stories'
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
                <ActionList.Item variant="danger" onSelect={event => event.preventDefault()}>
                  Delete file
                </ActionList.Item>
                <ActionList.LinkItem href="//github.com" title="anchor" aria-keyshortcuts="s">
                  Github
                </ActionList.LinkItem>
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
    toRender: () => <Example />,
  })

  checkExports('ActionMenu', {
    default: undefined,
    ActionMenu,
  })

  it('should open Menu on MenuButton click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should open Menu on MenuButton keypress', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    button.focus()
    await user.keyboard('{Enter}')

    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should close Menu on selecting an action with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    const menuItems = component.getAllByRole('menuitem')
    await user.click(menuItems[0])

    expect(component.queryByRole('menu')).toBeNull()
  })

  it('should close Menu on selecting an action with Enter', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    const menuItems = component.getAllByRole('menuitem')
    menuItems[0].focus()
    await user.keyboard('{Enter}')

    expect(component.queryByRole('menu')).toBeNull()
  })

  it('should not close Menu if event is prevented', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    const menuItems = component.getAllByRole('menuitem')
    await user.click(menuItems[3])

    // menu should still be open
    expect(component.getByRole('menu')).toBeInTheDocument()
  })

  it('should be able to select an Item with selectionVariant', async () => {
    const component = HTMLRender(
      <ThemeProvider theme={theme}>
        <SingleSelect />
      </ThemeProvider>,
    )
    const button = component.getByRole('button', {name: /^options/i})

    const user = userEvent.setup()
    await user.click(button)

    // select first item by role, that would close the menu
    await user.click(component.getAllByRole('menuitemradio')[0])
    expect(component.queryByRole('menu')).not.toBeInTheDocument()

    // open menu again and check if the first option is checked
    await user.click(button)
    expect(component.getAllByRole('menuitemradio')[0]).toHaveAttribute('aria-checked', 'true')
  })

  it('should assign the right roles with groups & mixed selectionVariant', async () => {
    const component = HTMLRender(
      <ThemeProvider theme={theme}>
        <MixedSelection />
      </ThemeProvider>,
    )

    const button = component.getByRole('button', {
      name: 'Group by Stage',
    })

    const user = userEvent.setup()
    await user.click(button)

    expect(component.getByLabelText('Status')).toHaveAttribute('role', 'menuitemradio')
    expect(component.getByLabelText('Clear Group by')).toHaveAttribute('role', 'menuitem')
  })

  it('should keep focus on Button when menu is opened with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first button
    expect(button).toEqual(document.activeElement) // trust, but verify

    await user.click(button)
    expect(component.queryByRole('menu')).toBeInTheDocument()
    expect(document.activeElement).toEqual(button)
  })

  it('should select first element when ArrowDown is pressed after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.queryByRole('menu')).toBeInTheDocument()

    // assumes button is the active element at this point
    await user.keyboard('{ArrowDown}')

    expect(component.getAllByRole('menuitem')[0]).toEqual(document.activeElement)
  })
  it('should be able to select an Item with aria-keyshortcuts after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)
    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.queryByRole('menu')).toBeInTheDocument()

    // linkItem button is the active element at this point
    await user.keyboard('{ArrowDown}{s}')

    expect(component.getAllByRole('menuitem')[4]).toEqual(document.activeElement)
    await user.keyboard('{ArrowUp}')
    expect(component.getAllByRole('menuitem')[3]).toEqual(document.activeElement)

    // assumes mnemonics aria-keyshortcuts are ignored
    await user.keyboard('{g}')
    expect(component.getAllByRole('menuitem')[3]).toEqual(document.activeElement)
  })

  it('should select last element when ArrowUp is pressed after opening Menu with click', async () => {
    const component = HTMLRender(<Example />)

    const button = component.getByRole('button')

    const user = userEvent.setup()
    await user.click(button)

    expect(component.queryByRole('menu')).toBeInTheDocument()

    // button should be the active element
    // assumes button is the active element at this point
    await user.keyboard('{ArrowUp}')

    expect(component.getAllByRole('menuitem').pop()).toEqual(document.activeElement)
  })

  it('should close the menu if Tab is pressed and move to next element', async () => {
    const component = HTMLRender(
      <>
        <Example />
        <input type="text" placeholder="next focusable element" />
      </>,
    )
    const anchor = component.getByRole('button')

    const user = userEvent.setup()
    await user.tab() // tab into the story, this should focus on the first button
    expect(anchor).toEqual(document.activeElement) // trust, but verify

    await user.keyboard('{Enter}')
    expect(component.queryByRole('menu')).toBeInTheDocument()
    expect(component.getAllByRole('menuitem')[0]).toEqual(document.activeElement)

    // TODO: revisit why we need this waitFor
    await waitFor(async () => {
      await user.tab()
      expect(document.activeElement).toEqual(component.getByPlaceholderText('next focusable element'))
      expect(component.queryByRole('menu')).not.toBeInTheDocument()
    })
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Example />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
