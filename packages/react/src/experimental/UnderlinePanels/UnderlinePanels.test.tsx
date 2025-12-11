// Most of the functionality is already tested in [@github/tab-container-element](https://github.com/github/tab-container-element)

import {render, screen} from '@testing-library/react'
import {describe, it, afterEach, expect, vi} from 'vitest'
import UnderlinePanels from './UnderlinePanels'
import TabContainerElement from '@github/tab-container-element'
import {implementsClassName} from '../../utils/testing'
import classes from './UnderlinePanels.module.css'

TabContainerElement.prototype.selectTab = vi.fn()

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
  implementsClassName(UnderlinePanels, classes.StyledUnderlineWrapper)
  implementsClassName(UnderlinePanels.Tab)
  implementsClassName(UnderlinePanels.Panel)
  afterEach(() => {
    vi.restoreAllMocks()
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
  it('updates the selected tab when aria-selected changes', () => {
    const {rerender} = render(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab aria-selected={true}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab aria-selected={false}>Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    // Verify that the first tab is selected and second tab is not
    let firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    let secondTab = screen.getByRole('tab', {name: 'Tab 2'})

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveAttribute('aria-selected', 'false')

    // Programmatically select the second tab by updating the aria-selected prop
    rerender(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab aria-selected={false}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab aria-selected={true}>Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    // Verify the updated aria-selected prop changes which tab is selected
    firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    secondTab = screen.getByRole('tab', {name: 'Tab 2'})

    expect(firstTab).toHaveAttribute('aria-selected', 'false')
    expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })
  it('calls onSelect when a tab is clicked', () => {
    const onSelect = vi.fn()
    render(
      <UnderlinePanels aria-label="Select a tab">
        <UnderlinePanels.Tab onSelect={onSelect}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    const tab = screen.getByRole('tab', {name: 'Tab 1'})
    tab.click()

    expect(onSelect).toHaveBeenCalled()
  })

  it('throws an error when the number of tabs does not match the number of panels', () => {
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
  })

  it('throws an error when the number of panels does not match the number of tabs', () => {
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
  })

  it('throws an error when there are multiple items that have aria-selected', () => {
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
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => (
      <UnderlinePanels className={'test-class-name'}>
        <UnderlinePanels.Tab aria-selected={true}>Tab 1</UnderlinePanels.Tab>
        <UnderlinePanels.Tab aria-selected={false}>Tab 2</UnderlinePanels.Tab>
        <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>
    )

    const {container} = render(<Element />)

    expect(container.firstElementChild?.firstElementChild).toHaveClass('test-class-name')
  })
})
