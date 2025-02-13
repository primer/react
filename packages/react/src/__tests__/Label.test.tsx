import React from 'react'
import {render} from '@testing-library/react'
import axe from 'axe-core'
import type {LabelColorOptions} from '../Label'
import Label, {variants} from '../Label'
import {FeatureFlags} from '../FeatureFlags'

describe('Label', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Label className={'test-class-name'} />
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(render(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
  })
  it('renders text node child', () => {
    const container = render(<Label>Default</Label>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Default')
  })
  it('default size is rendered as "small"', () => {
    const {getByText} = render(<Label>Default</Label>)

    // Expect the label to have the default size
    expect(getByText('Default')).toHaveAttribute('data-size', 'small')
  })
  it('default variant is rendered as "default"', () => {
    const {getByText} = render(<Label>Default</Label>)

    expect(getByText('Default')).toHaveAttribute('data-variant', 'default')
  })
  it('should have no axe violations', async () => {
    for (const variant in variants) {
      const {container} = render(<Label variant={variant as LabelColorOptions}>Default</Label>)
      const results = await axe.run(container)
      expect(results).toHaveNoViolations()
    }
  })
})
