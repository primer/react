import React from 'react'
import {render, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {MarkGithubIcon} from '@primer/octicons-react'
import {Label} from '../Label2'
import {labelColorMap} from '../Label2/Label2'
import {LabelColorOptions} from '../Label2/types'
expect.extend(toHaveNoViolations)

describe('Label2', () => {
  it('renders text node child', () => {
    const container = render(<Label>Default</Label>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Default')
  })
  it('renders text node child in a filled label', () => {
    const container = render(<Label filled>Default</Label>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Default')
  })
  it('renders element children', () => {
    const {getByTestId} = render(
      <Label>
        <span data-testid="child-1">De</span>
        <span data-testid="child-2">fault</span>
      </Label>
    )
    const child1 = getByTestId('child-1')
    const child2 = getByTestId('child-2')
    expect(child1).toBeDefined()
    expect(child2).toBeDefined()
  })
  it('renders with a leadingVisual', () => {
    const {getByLabelText} = render(
      <Label leadingVisual={() => <MarkGithubIcon aria-label="leadingViz" />}>Label</Label>
    )
    const leadingVisual = getByLabelText('leadingViz')
    expect(leadingVisual).toBeDefined()
  })
  it('does not render the leadingVisual when size="sm"', () => {
    const {queryByLabelText} = render(
      <Label leadingVisual={() => <MarkGithubIcon aria-label="leadingViz" />} size="sm">
        Label
      </Label>
    )
    const leadingVisual = queryByLabelText('leadingViz')
    expect(leadingVisual).toBeNull()
  })
  it('warns users if they try and render a leadingVisual in a small label', () => {
    const consoleSpy = jest.spyOn(global.console, 'warn')
    render(
      <Label leadingVisual={() => <MarkGithubIcon aria-label="leadingViz" />} size="sm">
        Label
      </Label>
    )
    expect(consoleSpy).toHaveBeenCalled()
  })
  it('should have no axe violations', async () => {
    for (const appearance in labelColorMap) {
      const {container} = render(
        <Label appearance={appearance as LabelColorOptions} filled>
          Default
        </Label>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    }
  })
})
