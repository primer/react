import React from 'react'
import { render, screen } from '@testing-library/react'
import TabPanels from '../TabPanels'

describe('TabPanels', () => {
  //Reset mocks after each test
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children correctly', () => {
    render(
      <TabPanels>
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>
    )

    expect(screen.getByText('Tab 1')).toBeInTheDocument()
    expect(screen.getByText('Tab 2')).toBeInTheDocument()
    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  it('applies aria-selected to selected tab', () => {
    render(
      <TabPanels>
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab selected>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>
    )

    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'true')
  })

  it('throws an error if there are no tabs', () => {
    jest.spyOn(console, 'error').mockImplementation()
    expect(() => {
      render(
        <TabPanels>
          <TabPanels.Panel>Panel 1</TabPanels.Panel>
        </TabPanels>
      )
    }).toThrowError('TabPanels must have at least one Tab')
  })

  it('throws an error if there are unequal tabs and panels', () => {
    jest.spyOn(console, 'error').mockImplementation()
    expect(() => {
      render(
        <TabPanels>
          <TabPanels.Tab>Tab 1</TabPanels.Tab>
          <TabPanels.Panel>Panel 1</TabPanels.Panel>
          <TabPanels.Panel>Panel 2</TabPanels.Panel>
        </TabPanels>
      )
    }).toThrowError('TabPanels must have equal Panels and Tabs')
  })

  it ('Adds aria-selected to the first tab by default', () => {
    render(
      <TabPanels>
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>
    )

    expect(screen.getByText('Tab 1')).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Tab 2')).toHaveAttribute('aria-selected', 'false')
  })

  it ('Adds hidden attribute to the second panel by default', () => {
    render(
      <TabPanels>
        <TabPanels.Tab>Tab 1</TabPanels.Tab>
        <TabPanels.Tab>Tab 2</TabPanels.Tab>
        <TabPanels.Panel>Panel 1</TabPanels.Panel>
        <TabPanels.Panel>Panel 2</TabPanels.Panel>
      </TabPanels>
    )

    expect(screen.getByText('Panel 1')).not.toHaveAttribute('hidden')
    expect(screen.getByText('Panel 2')).toHaveAttribute('hidden')
  })
})
