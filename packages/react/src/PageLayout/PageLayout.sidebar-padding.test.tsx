import {describe, it, expect} from 'vitest'
import {render} from '@testing-library/react'
import {PageLayout} from './PageLayout'

describe('PageLayout.Sidebar padding', () => {
  it('applies sidebar padding when the root has no padding', () => {
    const {container} = render(
      <PageLayout padding="none">
        <PageLayout.Content>Content</PageLayout.Content>
        <PageLayout.Sidebar padding="condensed">Sidebar</PageLayout.Sidebar>
      </PageLayout>,
    )

    const sidebar = container.querySelector<HTMLElement>('[data-component="PageLayout.Sidebar"]')
    expect(sidebar).not.toBeNull()
    expect(getComputedStyle(sidebar!).paddingTop).toBe('16px')
  })
})
