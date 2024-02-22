import React from 'react'
import {render, screen} from '@testing-library/react'
import TabPanels from '../TabPanels'
import TabContainerElement from '@github/tab-container-element'

// Mock the tab-container-element package
// jest.mock('@github/tab-container-element', () => {
//   return {
//     __esModule: true,
//     default: 'TabContainerElement',
//     TabContainerChangeEvent: 'TabContainerChangeEvent',
//   }
// })

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
      <TabPanels>
        <TabPanels.Tab id="tab-1">Tab 1</TabPanels.Tab>
        <TabPanels.Tab id="tab-2">Tab 2</TabPanels.Tab>
        <TabPanels.Panel aria-labelledby="tab-1">Panel 1</TabPanels.Panel>
        <TabPanels.Panel aria-labelledby="tab-2">Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('applies aria-selected to first tab when selected', () => {
    render(
      <TabPanels>
        <TabPanels.Tab id="tab-1" selected>
          Tab 1
        </TabPanels.Tab>
        <TabPanels.Tab id="tab-2">Tab 2</TabPanels.Tab>
        <TabPanels.Panel aria-labelledby="tab-1">Panel 1</TabPanels.Panel>
        <TabPanels.Panel aria-labelledby="tab-2">Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'false')
  })

  it('applies aria-selected to second tab when selected', () => {
    render(
      <TabPanels>
        <TabPanels.Tab id="tab-1">Tab 1</TabPanels.Tab>
        <TabPanels.Tab id="tab-2" selected>
          Tab 2
        </TabPanels.Tab>
        <TabPanels.Panel aria-labelledby="tab-1">Panel 1</TabPanels.Panel>
        <TabPanels.Panel aria-labelledby="tab-2">Panel 2</TabPanels.Panel>
      </TabPanels>,
    )

    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'true')
  })
})
