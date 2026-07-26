import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it} from 'vitest'
import {NavList} from './NavList'

afterEach(cleanup)

describe('NavList', () => {
  it('preserves landmark, heading, list, and current-page semantics', () => {
    render(
      <NavList>
        <NavList.Heading>Repository</NavList.Heading>
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

  it('keeps a trailing action outside the navigation link', () => {
    render(
      <NavList aria-label="Repository">
        <NavList.Item href="/issues">
          Issues
          <NavList.Description>Open issues</NavList.Description>
          <NavList.TrailingAction label="Issue actions" />
        </NavList.Item>
      </NavList>,
    )

    const link = screen.getByRole('link', {name: 'Issues,Open issues'})
    const action = screen.getByRole('button', {name: 'Issue actions'})
    expect(link).toContainElement(screen.getByText('Open issues'))
    expect(link).not.toContainElement(action)
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

  it('finds a heading that is grouped in a fragment', () => {
    render(
      <NavList>
        <>
          <NavList.Heading>Repository</NavList.Heading>
          <NavList.Item href="#code">Code</NavList.Item>
        </>
      </NavList>,
    )

    expect(screen.getByRole('navigation')).toHaveAccessibleName('Repository')
  })
})
