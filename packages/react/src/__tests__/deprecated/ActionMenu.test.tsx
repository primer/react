import {render as HTMLRender, fireEvent} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import theme from '../../theme'
import {ActionMenu} from '../../deprecated'
import {behavesAsComponent, checkExports} from '../../utils/testing'
import {BaseStyles, ThemeProvider} from '../..'
import type {ItemProps} from '../../deprecated/ActionList/Item'

const items = [
  {text: 'New file'},
  {text: 'Copy link'},
  {text: 'Edit file'},
  {text: 'Delete file', variant: 'danger'},
] as ItemProps[]

const mockOnActivate = jest.fn()

function SimpleActionMenu(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <div id="something-else">X</div>
        <ActionMenu onAction={mockOnActivate} anchorContent="Menu" items={items} />
        <div id="portal-root"></div>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('ActionMenu', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  behavesAsComponent({
    Component: ActionMenu,
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionMenu items={[]} />,
  })

  checkExports('deprecated/ActionMenu', {
    default: undefined,
    ActionMenu,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionMenu />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should trigger the overlay on trigger click', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    fireEvent.click(anchor)
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const itemText = items
      .map((i: ItemProps) => {
        if (i.hasOwnProperty('text')) {
          return i.text
        }
      })
      .join('')
    expect(portalRoot?.textContent?.trim()).toEqual(itemText)
  })

  it('should dismiss the overlay on menuitem click', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    fireEvent.click(anchor)
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const menuItem = menu.queryByText(items[0].text!)
    fireEvent.click(menuItem as Element)
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })

  it('should dismiss the overlay on clicking outside overlay', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    fireEvent.click(anchor)
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const somethingElse = (await menu.baseElement.querySelector('#something-else')) as HTMLElement
    fireEvent.mouseDown(somethingElse)
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })

  it('should pass correct values to onAction on menu click', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    fireEvent.click(anchor)
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const menuItem = (await portalRoot?.querySelector("[role='menuitem']")) as HTMLElement
    fireEvent.click(menuItem)

    // onAction has been called with correct argument
    expect(mockOnActivate).toHaveBeenCalledTimes(1)
    const arg = mockOnActivate.mock.calls[0][0]
    expect(arg.text).toEqual(items[0].text)
  })
})
