import {cleanup, render as HTMLRender, act, fireEvent} from '@testing-library/react'
import 'babel-polyfill'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import theme from '../theme'
import {DropdownMenu, DropdownButton} from '../DropdownMenu'
import {COMMON} from '../constants'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {BaseStyles, ThemeProvider} from '..'
import {ItemInput} from '../ActionList/List'

expect.extend(toHaveNoViolations)

const items = [{text: 'Foo'}, {text: 'Bar'}, {text: 'Baz'}, {text: 'Bon'}] as ItemInput[]

function SimpleDropdownMenu(): JSX.Element {
  const [selectedItem, setSelectedItem] = React.useState<ItemInput | undefined>()

  return (
    <ThemeProvider theme={theme}>
      <BaseStyles>
        <div id="something-else">X</div>
        <DropdownMenu
          items={items}
          placeholder="Select an Option"
          selectedItem={selectedItem}
          onChange={setSelectedItem}
        />
        <div id="portal-root"></div>
      </BaseStyles>
    </ThemeProvider>
  )
}

describe('DropdownMenu', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  behavesAsComponent({
    Component: DropdownMenu,
    systemPropArray: [COMMON],
    options: {skipAs: true, skipSx: true},
    toRender: () => <DropdownMenu items={[]} />
  })

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
    act(() => {
      fireEvent.click(anchor)
    })
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const itemText = items
      .map((i: ItemInput) => {
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
    act(() => {
      fireEvent.click(anchor)
    })
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
    act(() => {
      fireEvent.click(anchor)
    })
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
    act(() => {
      fireEvent.click(anchor)
    })
    portalRoot = menu.baseElement.querySelector('#__primerPortalRoot__')
    expect(portalRoot).toBeTruthy()
    const somethingElse = (await menu.baseElement.querySelector('#something-else')) as HTMLElement
    act(() => {
      fireEvent.click(somethingElse)
    })
    // portal is closed after click
    expect(portalRoot?.textContent).toEqual('') // menu items are hidden
  })
})
