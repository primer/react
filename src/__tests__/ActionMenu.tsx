import {cleanup, render as HTMLRender, act, fireEvent} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {ActionMenu} from '../ActionMenu'
import {COMMON} from '../constants'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider} from '..'
import {ItemProps} from '../ActionList/Item'
expect.extend(toHaveNoViolations)

const items = [
  {text: 'New file'},
  {text: 'Copy link'},
  {text: 'Edit file'},
  {text: 'Delete file', variant: 'danger'}
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
    systemPropArray: [COMMON],
    options: {skipAs: true, skipSx: true},
    toRender: () => <ActionMenu items={[]} />
  })

  checkExports('ActionMenu', {
    default: undefined,
    ActionMenu
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('should trigger the overlay on trigger click', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    act(() => {
      fireEvent.click(anchor)
    })
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const itemText = items
      .map((i: ItemProps) => {
        if (i.hasOwnProperty('text')) return i?.text
      })
      .join('')
    expect(portalRoot?.textContent?.trim()).toEqual(itemText)
  })

  it('should dismiss the overlay on menuitem click', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    act(() => {
      fireEvent.click(anchor)
    })
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const menuItem = await menu.queryByText(items[0].text!)
    act(() => {
      fireEvent.click(menuItem as Element)
    })
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })

  it('should dismiss the overlay on clicking outside overlay', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    act(() => {
      fireEvent.click(anchor)
    })
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const somethingElse = (await menu.baseElement.querySelector('#something-else')) as HTMLElement
    act(() => {
      fireEvent.click(somethingElse)
    })
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })

  it('should pass correct values to onAction on menu click', async () => {
    const menu = HTMLRender(<SimpleActionMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Menu')
    act(() => {
      fireEvent.click(anchor)
    })
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const menuItem = (await portalRoot?.querySelector("[role='menuitem']")) as HTMLElement
    act(() => {
      fireEvent.click(menuItem)
    })
    // onAction has been called with correct argument
    expect(mockOnActivate).toHaveBeenCalledTimes(1)
    const arg = mockOnActivate.mock.calls[0][0]
    expect(arg.text).toEqual(items[0].text)
  })
})
