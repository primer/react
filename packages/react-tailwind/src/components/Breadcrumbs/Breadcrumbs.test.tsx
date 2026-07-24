import React from 'react'
import {renderToString} from 'react-dom/server'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
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
})
