// Most of the functionality is already tested in [@github/tab-container-element](https://github.com/github/tab-container-element)

import React from 'react'
import {render, screen} from '@testing-library/react'
import UnderlinePanels from './UnderlinePanels'
import {behavesAsComponent} from '../../utils/testing'
import TabContainerElement from '@github/tab-container-element'

TabContainerElement.prototype.selectTab = jest.fn()

const UnderlinePanelsMockComponent = (props: {'aria-label'?: string; 'aria-labelledby'?: string; id?: string}) => (
  <UnderlinePanels {...props}>
    <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

describe('UnderlinePanels', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  behavesAsComponent({Component: UnderlinePanels, options: {skipAs: true}})

  behavesAsComponent({Component: UnderlinePanels.Tab})

  it('renders without errors', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" />)
  })

  it('renders with a custom ID', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" id="custom-id" />)

    const firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    const firstPanel = screen.getByText('Panel 1')

    expect(firstTab).toHaveAttribute('id', 'custom-id-tab-0')
    expect(firstPanel).toHaveAttribute('aria-labelledby', 'custom-id-tab-0')
  })
  it('renders aria-label', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" />)

    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveAccessibleName('Select a tab')
  })
  it('renders aria-labelledby', () => {
    render(
      <>
        <h2 id="tab-header">Select a tab</h2>
        <UnderlinePanelsMockComponent aria-labelledby="tab-header" />
      </>,
    )

    const tabList = screen.getByRole('tablist')
    expect(tabList).toHaveAccessibleName('Select a tab')
  })
  it('throws an error when the neither aria-label nor aria-labelledby are passed', () => {
    render(<UnderlinePanelsMockComponent />)
  })
  it('throws an error when the number of tabs does not match the number of panels', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    expect(() => {
      render(
        <UnderlinePanels aria-label="Select a tab">
          <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )
    }).toThrow('The number of tabs and panels must be equal. Counted 2 tabs and 3 panels.')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
  it('throws an error when the number of panels does not match the number of tabs', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    expect(() => {
      render(
        <UnderlinePanels aria-label="Select a tab">
          <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )
    }).toThrow('The number of tabs and panels must be equal. Counted 3 tabs and 2 panels.')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
  it('throws an error when there are multiple items that have aria-selected', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    expect(() => {
      render(
        <UnderlinePanels aria-label="Select a tab">
          <UnderlinePanels.Tab aria-selected={true}>Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab aria-selected={true}>Tab 2</UnderlinePanels.Tab>
          <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
          <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
          <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
        </UnderlinePanels>,
      )
    }).toThrow('Only one tab can be selected at a time.')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
