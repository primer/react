import React from 'react'
import {render, screen, within} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {BehaviorGuardrails} from './BehaviorGuardrails'

describe('BehaviorGuardrails', () => {
  it('renders nothing when no guardrails are provided', () => {
    const {container} = render(<BehaviorGuardrails />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders built-in behaviors, default behaviors, Do-before-Dont usage guidelines with Runtime/Review checks, and related guidelines', () => {
    render(
      <BehaviorGuardrails
        builtInBehaviors={[
          {
            id: 'single-button-trigger',
            description: 'Composing a trigger with render produces one button element.',
          },
        ]}
        defaultBehaviors={[
          {
            id: 'multiselect-stays-open',
            overriddenBy: ['CheckboxItem.closeOnClick'],
            description: 'Toggling a CheckboxItem keeps the menu open.',
          },
        ]}
        usageGuidelines={[
          {
            id: 'no-nested-button-in-trigger',
            guidance: 'dont',
            check: 'runtime',
            description: 'Nest a Button inside ActionMenu.Button.',
          },
          {
            id: 'use-render-for-custom-triggers',
            guidance: 'do',
            check: 'review',
            description: 'Attach custom buttons with ActionMenu.Trigger render.',
          },
        ]}
        relatedGuardrails={[
          {
            sourceComponent: 'ActionMenu',
            builtInBehaviors: [
              {
                id: 'trigger-tooltip-steps-aside',
                description: 'Opening the menu hides its trigger tooltip.',
              },
            ],
          },
        ]}
      />,
    )

    const builtInTable = screen.getByRole('table', {name: 'Built-in behaviors'})
    expect(
      within(builtInTable).getByText('Composing a trigger with render produces one button element.'),
    ).toBeInTheDocument()

    const defaultTable = screen.getByRole('table', {name: 'Default behaviors'})
    expect(within(defaultTable).getByText('CheckboxItem.closeOnClick')).toBeInTheDocument()

    const guidelinesTable = screen.getByRole('table', {name: 'Usage guidelines'})
    const bodyRows = within(guidelinesTable).getAllByRole('row').slice(1)
    expect(bodyRows[0]).toHaveTextContent('Do')
    expect(bodyRows[0]).toHaveTextContent('Review')
    expect(bodyRows[1]).toHaveTextContent("Don't")
    expect(bodyRows[1]).toHaveTextContent('Runtime')

    const relatedTable = screen.getByRole('table', {name: 'Related component guidelines'})
    expect(within(relatedTable).getByText('ActionMenu')).toBeInTheDocument()
    expect(within(relatedTable).getByText('Opening the menu hides its trigger tooltip.')).toBeInTheDocument()
  })
})
