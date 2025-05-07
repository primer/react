import React from 'react'
import {describe, expect, it, afterEach, vi} from 'vitest'
import {render, screen, act} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ActionBar from './'
import {BoldIcon, CodeIcon, ItalicIcon, LinkIcon} from '@primer/octicons-react'

const SimpleActionBar = () => (
  <ActionBar aria-label="Toolbar">
    <ActionBar.IconButton icon={BoldIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={ItalicIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.Divider />
    <ActionBar.IconButton icon={CodeIcon} aria-label="Default"></ActionBar.IconButton>
    <ActionBar.IconButton icon={LinkIcon} aria-label="Default"></ActionBar.IconButton>
  </ActionBar>
)

describe('ActionBar', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should not trigger disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')
    button.click()

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button', () => {
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')
    button.click()

    expect(onClick).toHaveBeenCalled()
  })

  it('should not trigger disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = screen.getByRole('button')

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalled()
  })
})
