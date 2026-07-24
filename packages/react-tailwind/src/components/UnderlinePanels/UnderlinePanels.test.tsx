import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it} from 'vitest'
import {UnderlinePanels} from './UnderlinePanels'

describe('UnderlinePanels', () => {
  it('composes Tabs with accessible keyboard panel selection', async () => {
    const user = userEvent.setup()
    render(
      <UnderlinePanels defaultValue="a">
        <UnderlinePanels.List aria-label="Sections">
          <UnderlinePanels.Tab value="a">Activity</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="b">Security</UnderlinePanels.Tab>
        </UnderlinePanels.List>
        <UnderlinePanels.Panel value="a">Activity content</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="b">Security content</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )
    await user.click(screen.getByRole('tab', {name: 'Activity'}))
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', {name: 'Security'})).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security content')
    expect(screen.getByRole('tablist')).toHaveAttribute('data-component', 'UnderlinePanels.List')
    expect(screen.getByRole('tab', {name: 'Security'})).toHaveAttribute('data-component', 'UnderlinePanels.Tab')
    expect(screen.getByRole('tabpanel')).toHaveAttribute('data-component', 'UnderlinePanels.Panel')
  })
})
