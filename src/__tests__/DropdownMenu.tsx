import {cleanup, render as HTMLRender, act, fireEvent} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {DropdownMenu, DropdownButton} from '../DropdownMenu'
import {COMMON} from '../constants'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {ThemeProvider} from 'styled-components'
import {BaseStyles} from '..'
import {registerPortalRoot} from '../Portal/index'
import {ItemProps} from '../ActionList/Item'

expect.extend(toHaveNoViolations)

const items = [{text: 'Foo'}, {text: 'Bar'}, {text: 'Baz'}, {text: 'Bon'}] as ItemProps[]

function SimpleDropdownMenu(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <div id="something-else">X</div>
        <DropdownMenu items={items} placeholder="Select an Option" />
        <div id="portal-root"></div>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('DropdownMenu', () => {
  afterEach(() => {
    // since the registry is global, reset after each test
    registerPortalRoot(undefined)
    jest.clearAllMocks()
  })

  behavesAsComponent({Component: DropdownMenu, systemPropArray: [COMMON], options: {skipAs: true, skipSx: true}})

  checkExports('DropdownMenu', {
    default: undefined,
    DropdownMenu,
    DropdownButton
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleDropdownMenu />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('should trigger the overlay on trigger click', async () => {
    const menu = HTMLRender(<SimpleDropdownMenu />)
    let portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Select an Option')
    await anchor?.click()
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const itemText = items
      .map((i: ItemProps) => {
        if (i.hasOwnProperty('text')) return i?.text
      })
      .join('')
    expect(portalRoot?.textContent?.trim()).toEqual(itemText)
  })

  it('should dismiss the overlay on dropdown item click', async () => {
    const menu = HTMLRender(<SimpleDropdownMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Select an Option')
    await anchor.click()
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const menuItem = await menu.queryByText('Baz')
    act(() => {
      fireEvent.click(menuItem as Element)
    })
    // portal is closed after click
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })

  it('option should be selected when chosen from the dropdown menu', async () => {
    const menu = HTMLRender(<SimpleDropdownMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Select an Option')
    await anchor.click()
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const menuItem = await menu.queryByText('Baz')
    act(() => {
      fireEvent.click(menuItem as Element)
    })
    expect(anchor?.textContent).toEqual('Baz')
  })

  it('should dismiss the overlay on clicking outside overlay', async () => {
    const menu = HTMLRender(<SimpleDropdownMenu />)
    let portalRoot = await menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeNull()
    const anchor = await menu.findByText('Select an Option')
    await anchor.click()
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const somethingElse = (await menu.baseElement.querySelector('#something-else')) as HTMLElement
    await somethingElse?.click()
    // portal is closed after click
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })
})
