import React from 'react'
import {renderToString} from 'react-dom/server'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {BaseStyles} from '../../BaseStyles'
import {Breadcrumbs} from './Breadcrumbs'

describe('Breadcrumbs', () => {
  it('renders a labelled navigation list and marks the current item', () => {
    render(
      <Breadcrumbs data-testid="breadcrumbs">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/settings" selected>
          Settings
        </Breadcrumbs.Item>
      </Breadcrumbs>,
    )
    expect(screen.getByRole('navigation', {name: 'Breadcrumbs'})).toBe(screen.getByTestId('breadcrumbs'))
    expect(screen.getByRole('link', {name: 'Settings'})).toHaveAttribute('aria-current', 'page')
  })

  it('can be server-rendered before overflow measurement', () => {
    const html = renderToString(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/settings">Settings</Breadcrumbs.Item>
      </Breadcrumbs>,
    )
    expect(html).toContain('data-breadcrumb-measurement')
    expect(html).not.toContain('details')
  })

  it('portals overflow links as menu items without nesting interactive elements', async () => {
    const clientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    Object.defineProperties(HTMLElement.prototype, {
      clientWidth: {configurable: true, get: () => 200},
      offsetWidth: {configurable: true, get: () => 100},
    })

    try {
      const user = userEvent.setup()
      render(
        <BaseStyles>
          <Breadcrumbs overflow="menu">
            <Breadcrumbs.Item href="/">Home</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/products">Products</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/category">Category</Breadcrumbs.Item>
            <Breadcrumbs.Item href="/current" selected>
              Current Page
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </BaseStyles>,
      )

      await user.click(await screen.findByRole('button', {name: '3 more breadcrumb items'}))
      const home = await screen.findByRole('menuitem', {name: 'Home'})
      expect(home).toHaveAttribute('href', '/')
      expect(home).not.toContainElement(home.querySelector('a'))
      expect(home.closest('[data-portal-root]')).not.toBeNull()
    } finally {
      if (clientWidth) Object.defineProperty(HTMLElement.prototype, 'clientWidth', clientWidth)
      else delete (HTMLElement.prototype as {clientWidth?: number}).clientWidth
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', offsetWidth)
      else delete (HTMLElement.prototype as {offsetWidth?: number}).offsetWidth
    }
  })
})
