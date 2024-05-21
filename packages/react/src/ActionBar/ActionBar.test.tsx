import React from 'react'
import {behavesAsComponent} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
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
})
