import React from 'react'
import {render, screen} from '@testing-library/react'
import TabPanels from '../TabPanels'
import TabContainerElement from '@github/tab-container-element'

// Mock the selectTab method, jsdom doesn't like it
// But that doesn't matter because we're not testing the web component here
// Just the connection to the web component
TabContainerElement.prototype.selectTab = jest.fn()

describe('TabPanels', () => {
  //Reset mocks after each test
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children correctly', () => {
    render(
      <TabPanels id="tabs" aria-label="Tab panel example">
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('auto generates parent id correctly', () => {
    render(
      <TabPanels aria-label="Tab panel example">
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    const incorrectId = 'undefined-tab-0'

    expect(screen.getByText('Tab 1').id).not.toBe(incorrectId)
  })

  it('applies aria-selected to first tab when selected', () => {
    render(
      <TabPanels id="tabs" aria-label="Tab panel example" selectedTabIndex={0}>
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'false')
  })

  it('applies aria-selected to second tab when selected', () => {
    render(
      <TabPanels id="tabs" aria-label="Tab panel example" selectedTabIndex={1}>
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'true')
  })
})
