import {describe, expect, it, vi, afterEach} from 'vitest'
import {render as HTMLRender, fireEvent} from '@testing-library/react'
import BaseStyles from '../../BaseStyles'
import {ActionMenu} from '../../deprecated'
import type {ItemProps} from '../../deprecated/ActionList/Item'

import type {JSX} from 'react'

const items = [
  {text: 'New file'},
  {text: 'Copy link'},
  {text: 'Edit file'},
  {text: 'Delete file', variant: 'danger'},
] as ItemProps[]

const mockOnActivate = vi.fn()

function SimpleActionMenu(): JSX.Element {
  return (
    <BaseStyles>
      <div id="something-else">X</div>
      <ActionMenu onAction={mockOnActivate} anchorContent="Menu" items={items} />
      <div id="portal-root"></div>
    </BaseStyles>
  )
}

describe('ActionMenu', () => {
  afterEach(() => {
    vi.clearAllMocks()
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
        // eslint-disable-next-line no-prototype-builtins
        if (i.hasOwnProperty('text')) {
          return i.text
        }
      })
      .join('')
    expect(portalRoot?.textContent.trim()).toEqual(itemText)
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
