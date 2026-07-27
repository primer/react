import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {AccordionHeading, AccordionItem, AccordionPanel, AccordionRoot, AccordionTrigger} from './Accordion'
import classes from './Accordion.module.css'

function TestAccordion({
  defaultExpanded,
  onExpandedChange,
}: {
  defaultExpanded?: boolean
  onExpandedChange?: ({expanded}: {expanded: boolean}) => void
}) {
  return (
    <AccordionRoot>
      <AccordionItem defaultExpanded={defaultExpanded} onExpandedChange={onExpandedChange}>
        <AccordionHeading>
          <AccordionTrigger>Account settings</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Panel content</AccordionPanel>
      </AccordionItem>
    </AccordionRoot>
  )
}

describe('Accordion', () => {
  it('is collapsed by default', () => {
    render(<TestAccordion />)

    expect(screen.getByRole('button', {name: 'Account settings'})).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Panel content')).toHaveAttribute('hidden')
  })

  it('supports an initially expanded item', () => {
    render(<TestAccordion defaultExpanded />)

    expect(screen.getByRole('button', {name: 'Account settings'})).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Panel content')).not.toHaveAttribute('hidden')
  })

  it('automatically associates the trigger and panel IDs', () => {
    render(<TestAccordion />)

    const trigger = screen.getByRole('button', {name: 'Account settings'})
    const panel = screen.getByText('Panel content')

    expect(trigger.id).not.toBe('')
    expect(panel.id).not.toBe('')
    expect(trigger).toHaveAttribute('aria-controls', panel.id)
  })

  it('does not emit ID references to missing parts', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const {rerender} = render(
      <AccordionItem>
        <AccordionHeading>
          <AccordionTrigger>Trigger without panel</AccordionTrigger>
        </AccordionHeading>
      </AccordionItem>,
    )

    expect(screen.getByRole('button', {name: 'Trigger without panel'})).not.toHaveAttribute('aria-controls')

    rerender(
      <AccordionItem defaultExpanded>
        <AccordionPanel role="region">Panel without trigger</AccordionPanel>
      </AccordionItem>,
    )

    expect(screen.getByText('Panel without trigger')).toHaveAttribute('role', 'region')
    expect(screen.getByText('Panel without trigger')).not.toHaveAttribute('aria-labelledby')
    consoleWarn.mockRestore()
  })

  it('toggles when clicked', async () => {
    const user = userEvent.setup()
    render(<TestAccordion />)

    const trigger = screen.getByRole('button', {name: 'Account settings'})
    await user.click(trigger)

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Panel content')).not.toHaveAttribute('hidden')
  })

  it('toggles with native Enter and Space button activation', async () => {
    const user = userEvent.setup()
    render(<TestAccordion />)

    const trigger = screen.getByRole('button', {name: 'Account settings'})
    trigger.focus()

    await user.keyboard('{Enter}')
    expect(trigger).toHaveAttribute('aria-expanded', 'true')

    await user.keyboard(' ')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  it('calls onExpandedChange with an extensible object argument', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(<TestAccordion onExpandedChange={onExpandedChange} />)

    await user.click(screen.getByRole('button', {name: 'Account settings'}))

    expect(onExpandedChange).toHaveBeenCalledWith({expanded: true})
  })

  it('supports controlled expansion', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    const {rerender} = render(
      <AccordionItem expanded={false} onExpandedChange={onExpandedChange}>
        <AccordionHeading>
          <AccordionTrigger>Controlled item</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Controlled panel</AccordionPanel>
      </AccordionItem>,
    )

    const trigger = screen.getByRole('button', {name: 'Controlled item'})
    await user.click(trigger)

    expect(onExpandedChange).toHaveBeenCalledWith({expanded: true})
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Controlled panel')).toHaveAttribute('hidden')

    rerender(
      <AccordionItem expanded onExpandedChange={onExpandedChange}>
        <AccordionHeading>
          <AccordionTrigger>Controlled item</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Controlled panel</AccordionPanel>
      </AccordionItem>,
    )

    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Controlled panel')).not.toHaveAttribute('hidden')
  })

  it('calls a consumer onClick before toggling', async () => {
    const user = userEvent.setup()
    const callOrder: string[] = []
    render(
      <AccordionItem onExpandedChange={() => callOrder.push('change')}>
        <AccordionHeading>
          <AccordionTrigger onClick={() => callOrder.push('click')}>Composed click</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Composed panel</AccordionPanel>
      </AccordionItem>,
    )

    await user.click(screen.getByRole('button', {name: 'Composed click'}))

    expect(callOrder).toEqual(['click', 'change'])
  })

  it('does not toggle when a consumer onClick prevents the default', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <AccordionItem onExpandedChange={onExpandedChange}>
        <AccordionHeading>
          <AccordionTrigger onClick={event => event.preventDefault()}>Prevented click</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Prevented panel</AccordionPanel>
      </AccordionItem>,
    )

    await user.click(screen.getByRole('button', {name: 'Prevented click'}))

    expect(onExpandedChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', {name: 'Prevented click'})).toHaveAttribute('aria-expanded', 'false')
  })

  it('does not activate a disabled trigger', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <AccordionItem onExpandedChange={onExpandedChange}>
        <AccordionHeading>
          <AccordionTrigger disabled>Disabled item</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Disabled panel</AccordionPanel>
      </AccordionItem>,
    )

    const trigger = screen.getByRole('button', {name: 'Disabled item'})
    await user.click(trigger)

    expect(trigger).toBeDisabled()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(onExpandedChange).not.toHaveBeenCalled()
  })

  it('renders an h3 heading by default and supports custom heading levels', () => {
    const {rerender} = render(
      <AccordionItem>
        <AccordionHeading>
          <AccordionTrigger>Default heading</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Default panel</AccordionPanel>
      </AccordionItem>,
    )
    expect(screen.getByRole('heading', {level: 3, name: 'Default heading'})).toBeInTheDocument()

    rerender(
      <AccordionItem>
        <AccordionHeading as="h2">
          <AccordionTrigger>Custom heading</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Custom panel</AccordionPanel>
      </AccordionItem>,
    )
    expect(screen.getByRole('heading', {level: 2, name: 'Custom heading'})).toBeInTheDocument()
  })

  it('omits a panel region by default and supports an automatically labelled region', () => {
    const {rerender} = render(
      <AccordionItem defaultExpanded>
        <AccordionHeading>
          <AccordionTrigger>Without region</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel>Panel without region</AccordionPanel>
      </AccordionItem>,
    )
    expect(screen.queryByRole('region')).not.toBeInTheDocument()

    rerender(
      <AccordionItem defaultExpanded>
        <AccordionHeading>
          <AccordionTrigger>With region</AccordionTrigger>
        </AccordionHeading>
        <AccordionPanel role="region">Panel with region</AccordionPanel>
      </AccordionItem>,
    )

    const trigger = screen.getByRole('button', {name: 'With region'})
    expect(screen.getByRole('region', {name: 'With region'})).toHaveAttribute('aria-labelledby', trigger.id)
  })

  it('renders stable data-component values and expansion state', () => {
    const {container} = render(<TestAccordion defaultExpanded />)

    expect(container.querySelector('[data-component="Accordion"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Item"][data-expanded]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Heading"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Trigger"][data-expanded]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Panel"][data-expanded]')).toBeInTheDocument()
  })

  it('forwards className and rest props to each owned element', () => {
    const {container} = render(
      <AccordionRoot className="custom-root" aria-label="Settings sections">
        <AccordionItem className="custom-item" data-testid="item">
          <AccordionHeading className="custom-heading" title="Heading title">
            <AccordionTrigger className="custom-trigger" aria-describedby="trigger-description">
              Class names
            </AccordionTrigger>
          </AccordionHeading>
          <AccordionPanel className="custom-panel" data-testid="panel">
            Class panel
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    )

    expect(container.querySelector('[data-component="Accordion"]')).toHaveClass(classes.Accordion, 'custom-root')
    expect(container.querySelector('[data-component="Accordion"]')).toHaveAttribute('aria-label', 'Settings sections')
    expect(screen.getByTestId('item')).toHaveClass(classes.Item, 'custom-item')
    expect(container.querySelector('[data-component="Accordion.Heading"]')).toHaveClass(
      classes.Heading,
      'custom-heading',
    )
    expect(container.querySelector('[data-component="Accordion.Heading"]')).toHaveAttribute('title', 'Heading title')
    expect(screen.getByRole('button', {name: 'Class names'})).toHaveClass(classes.Trigger, 'custom-trigger')
    expect(screen.getByRole('button', {name: 'Class names'})).toHaveAttribute('aria-describedby', 'trigger-description')
    expect(screen.getByTestId('panel')).toHaveClass(classes.Panel, 'custom-panel')
  })

  it('forwards refs for every DOM-owning component', () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const itemRef = React.createRef<HTMLDivElement>()
    const headingRef = React.createRef<HTMLHeadingElement>()
    const triggerRef = React.createRef<HTMLButtonElement>()
    const panelRef = React.createRef<HTMLDivElement>()
    render(
      <AccordionRoot ref={rootRef}>
        <AccordionItem ref={itemRef}>
          <AccordionHeading ref={headingRef}>
            <AccordionTrigger ref={triggerRef}>Refs</AccordionTrigger>
          </AccordionHeading>
          <AccordionPanel ref={panelRef}>Ref panel</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    )

    expect(rootRef.current).toHaveAttribute('data-component', 'Accordion')
    expect(itemRef.current).toHaveAttribute('data-component', 'Accordion.Item')
    expect(headingRef.current).toHaveAttribute('data-component', 'Accordion.Heading')
    expect(triggerRef.current).toBe(screen.getByRole('button', {name: 'Refs'}))
    expect(panelRef.current).toBe(screen.getByText('Ref panel'))
  })

  it('warns when an item is missing required parts or has invalid heading structure', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <AccordionItem>
        <AccordionTrigger>Misnested trigger</AccordionTrigger>
      </AccordionItem>,
    )

    expect(consoleWarn).toHaveBeenCalledWith('Warning:', 'AccordionItem: Render one AccordionPanel.')
    expect(consoleWarn).toHaveBeenCalledWith(
      'Warning:',
      'AccordionItem: AccordionTrigger must be a direct child of a heading element.',
    )
    consoleWarn.mockRestore()
  })

  it('warns when the trigger does not have an accessible name', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <AccordionItem>
        <AccordionHeading>
          <AccordionTrigger />
        </AccordionHeading>
        <AccordionPanel>Unnamed panel</AccordionPanel>
      </AccordionItem>,
    )

    expect(consoleWarn).toHaveBeenCalledWith(
      'Warning:',
      'AccordionItem: AccordionTrigger must have an accessible name.',
    )
    consoleWarn.mockRestore()
  })

  it.each([
    ['AccordionHeading', <AccordionHeading key="heading">Heading</AccordionHeading>],
    ['AccordionTrigger', <AccordionTrigger key="trigger">Trigger</AccordionTrigger>],
    ['AccordionPanel', <AccordionPanel key="panel">Panel</AccordionPanel>],
  ])('throws when %s is used outside AccordionItem', (componentName, component) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      expect(() => render(component)).toThrow(`${componentName} must be rendered within an AccordionItem.`)
    } finally {
      consoleError.mockRestore()
    }
  })
})
