import {render, screen} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import {UnderlinePanels, type UnderlinePanelsTabListProps} from './UnderlinePanels'
import {userEvent} from 'vitest/browser'

const UnderlinePanelsMockComponent = ({id, ...rest}: {id?: string} & UnderlinePanelsTabListProps) => (
  <UnderlinePanels defaultValue="tab-1" id={id}>
    <UnderlinePanels.TabList {...rest}>
      <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Tab value="tab-3">Tab 3</UnderlinePanels.Tab>
    </UnderlinePanels.TabList>
    <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel value="tab-3">Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

describe('UnderlinePanels', () => {
  it('renders with a custom ID', () => {
    render(<UnderlinePanelsMockComponent aria-label="Select a tab" id="custom-id" />)

    const firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    const firstPanel = screen.getByText('Panel 1')

    expect(firstTab).toHaveAttribute('id', 'custom-id-tab-tab-1')
    expect(firstPanel).toHaveAttribute('aria-labelledby', 'custom-id-tab-tab-1')
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
      <UnderlinePanels value="tab-1" onValueChange={() => {}}>
        <UnderlinePanels.TabList aria-label="Select a tab">
          <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
        </UnderlinePanels.TabList>
        <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    // Verify that the first tab is selected and second tab is not
    let firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    let secondTab = screen.getByRole('tab', {name: 'Tab 2'})

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveAttribute('aria-selected', 'false')

    // Programmatically select the second tab by updating the value prop
    rerender(
      <UnderlinePanels value="tab-2" onValueChange={() => {}}>
        <UnderlinePanels.TabList aria-label="Select a tab">
          <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
        </UnderlinePanels.TabList>
        <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    // Verify the updated aria-selected prop changes which tab is selected
    firstTab = screen.getByRole('tab', {name: 'Tab 1'})
    secondTab = screen.getByRole('tab', {name: 'Tab 2'})

    expect(firstTab).toHaveAttribute('aria-selected', 'false')
    expect(secondTab).toHaveAttribute('aria-selected', 'true')
  })
  it('calls onSelect when a tab is clicked', async () => {
    const onValueChange = vi.fn()
    const user = userEvent.setup()

    render(
      <UnderlinePanels value="tab-2" onValueChange={onValueChange}>
        <UnderlinePanels.TabList aria-label="Select a tab">
          <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
        </UnderlinePanels.TabList>
        <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>,
    )

    await user.click(await screen.findByText('Tab 1'))

    expect(onValueChange).toHaveBeenCalledWith({value: 'tab-1'})
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => (
      <UnderlinePanels defaultValue="tab-1">
        <UnderlinePanels.TabList className={'test-class-name'} aria-label="Select a tab">
          <UnderlinePanels.Tab value="tab-1">Tab 1</UnderlinePanels.Tab>
          <UnderlinePanels.Tab value="tab-2">Tab 2</UnderlinePanels.Tab>
        </UnderlinePanels.TabList>
        <UnderlinePanels.Panel value="tab-1">Panel 1</UnderlinePanels.Panel>
        <UnderlinePanels.Panel value="tab-2">Panel 2</UnderlinePanels.Panel>
      </UnderlinePanels>
    )

    const {container} = render(<Element />)

    expect(container.firstElementChild).toHaveClass('test-class-name')
  })
})
