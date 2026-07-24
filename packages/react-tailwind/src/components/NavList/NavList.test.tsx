import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {NavList} from './NavList'

afterEach(cleanup)

describe('NavList', () => {
  it('preserves landmark, heading, list, and current-page semantics', () => {
    render(
      <NavList aria-labelledby="nav-title">
        <NavList.Heading id="nav-title">Repository</NavList.Heading>
        <NavList.List>
          <NavList.Item href="/" aria-current="page">
            Overview
          </NavList.Item>
        </NavList.List>
      </NavList>,
    )
    expect(screen.getByRole('navigation', {name: 'Repository'})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'Repository'})).toBeInTheDocument()
    expect(screen.getByRole('link', {name: 'Overview'})).toHaveAttribute('aria-current', 'page')
  })

  it('composes a disclosure trigger with a list panel', async () => {
    const user = userEvent.setup()
    render(
      <NavList aria-label="Repository">
        <NavList.SubNav>
          <NavList.SubNav.Trigger>Files</NavList.SubNav.Trigger>
          <NavList.SubNav.Panel>
            <NavList.Item href="/readme">README</NavList.Item>
          </NavList.SubNav.Panel>
        </NavList.SubNav>
      </NavList>,
    )

    const trigger = screen.getByRole('button', {name: 'Files'})
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('list')).toContainElement(screen.getByRole('link', {name: 'README'}))
  })
})
