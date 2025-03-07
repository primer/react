import React from 'react'
import {behavesAsComponent} from '../utils/testing'
import userEvent from '@testing-library/user-event'
import {render as HTMLRender, act} from '@testing-library/react'
import axe from 'axe-core'

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
    jest.clearAllMocks()
  })

  behavesAsComponent({
    Component: ActionBar,
    options: {skipAs: true, skipSx: true},
    toRender: () => <SimpleActionBar />,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<SimpleActionBar />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should not trigger disabled button', () => {
    const onClick = jest.fn()
    const {getByRole} = HTMLRender(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = getByRole('button')
    button.click()

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button', () => {
    const onClick = jest.fn()
    const {getByRole} = HTMLRender(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = getByRole('button')
    button.click()

    expect(onClick).toHaveBeenCalled()
  })

  it('should not trigger disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const {getByRole} = HTMLRender(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick} disabled></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = getByRole('button')

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).not.toHaveBeenCalled()
  })

  it('should trigger non-disabled button with spacebar or enter', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    const {getByRole} = HTMLRender(
      <ActionBar aria-label="Toolbar">
        <ActionBar.IconButton icon={BoldIcon} aria-label="Default" onClick={onClick}></ActionBar.IconButton>
      </ActionBar>,
    )

    const button = getByRole('button')

    act(() => {
      button.focus()
    })

    await user.keyboard('{Enter}')

    expect(onClick).toHaveBeenCalled()
  })
})
