import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {describe, expect, it, vi} from 'vitest'
import {Accordion} from '.'
import classes from './Accordion.module.css'

function TestAccordion(props: Partial<React.ComponentProps<typeof Accordion.Item>> = {}) {
  return (
    <Accordion>
      <Accordion.Item {...props}>
        <Accordion.Heading>Section title</Accordion.Heading>
        <Accordion.Panel>Section content</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}

describe('Accordion', () => {
  it('renders collapsed by default and toggles when the trigger is clicked', async () => {
    const user = userEvent.setup()
    const {container, getByRole} = render(<TestAccordion />)
    const button = getByRole('button', {name: 'Section title'})
    const panel = container.querySelector('[data-component="Accordion.Panel"]')

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(panel).toHaveAttribute('hidden')

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(panel).not.toHaveAttribute('hidden')
  })

  it('renders an item expanded by default', () => {
    const {container, getByRole} = render(<TestAccordion defaultExpanded />)

    expect(getByRole('button', {name: 'Section title'})).toHaveAttribute('aria-expanded', 'true')
    expect(container.querySelector('[data-component="Accordion.Panel"]')).not.toHaveAttribute('hidden')
  })

  it('supports controlled expanded state and reports change requests', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    const {getByRole, rerender} = render(<TestAccordion expanded={false} onExpandedChange={onExpandedChange} />)

    await user.click(getByRole('button', {name: 'Section title'}))

    expect(onExpandedChange).toHaveBeenCalledWith({expanded: true})
    expect(getByRole('button', {name: 'Section title'})).toHaveAttribute('aria-expanded', 'false')

    rerender(<TestAccordion expanded onExpandedChange={onExpandedChange} />)

    expect(getByRole('button', {name: 'Section title'})).toHaveAttribute('aria-expanded', 'true')
  })

  it('uses heading, button, and panel relationships from the accordion pattern', () => {
    const {container, getByRole} = render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Heading as="h3">Section title</Accordion.Heading>
          <Accordion.Panel>Section content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    )
    const heading = getByRole('heading', {level: 3, name: 'Section title'})
    const button = getByRole('button', {name: 'Section title'})
    const panel = container.querySelector('[data-component="Accordion.Panel"]')

    expect(heading.tagName).toBe('H3')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(button).toHaveAttribute('aria-controls', panel?.id)
    expect(panel).toHaveAttribute('aria-labelledby', button.id)
    expect(panel).toHaveAttribute('hidden')
    expect(panel).not.toHaveAttribute('role')
  })

  it('allows a panel to opt into region semantics', () => {
    const {getByRole} = render(
      <Accordion>
        <Accordion.Item>
          <Accordion.Heading>Section title</Accordion.Heading>
          <Accordion.Panel role="region">Section content</Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    )

    expect(getByRole('region', {hidden: true})).toHaveAttribute('aria-labelledby')
  })

  it('renders stable data-component identifiers for public parts', () => {
    const {container} = render(<TestAccordion />)

    expect(container.querySelector('[data-component="Accordion"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Item"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Heading"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Accordion.Panel"]')).toBeInTheDocument()
  })

  it('forwards refs, class names, and rest props to public part roots', () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const itemRef = React.createRef<HTMLDivElement>()
    const headingRef = React.createRef<HTMLHeadingElement>()
    const panelRef = React.createRef<HTMLDivElement>()
    const {getByTestId} = render(
      <Accordion ref={rootRef} className="root" data-testid="root">
        <Accordion.Item ref={itemRef} className="item" data-testid="item">
          <Accordion.Heading ref={headingRef} className="heading" data-testid="heading">
            Section title
          </Accordion.Heading>
          <Accordion.Panel ref={panelRef} className="panel" data-testid="panel">
            Section content
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>,
    )

    expect(rootRef.current).toBe(getByTestId('root'))
    expect(itemRef.current).toBe(getByTestId('item'))
    expect(headingRef.current).toBe(getByTestId('heading'))
    expect(panelRef.current).toBe(getByTestId('panel'))
    expect(getByTestId('root')).toHaveClass('root', classes.Accordion)
    expect(getByTestId('item')).toHaveClass('item', classes.Item)
    expect(getByTestId('heading')).toHaveClass('heading', classes.Heading)
    expect(getByTestId('panel')).toHaveClass('panel', classes.Panel)
  })

  it('does not toggle a disabled item', async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    const {getByRole} = render(<TestAccordion disabled onExpandedChange={onExpandedChange} />)
    const button = getByRole('button', {name: 'Section title'})

    expect(button).toBeDisabled()
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(onExpandedChange).not.toHaveBeenCalled()
  })
})
