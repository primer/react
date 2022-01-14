import React from 'react'
import {render, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import Label, {labelColorMap, LabelColorOptions} from '../Label2'
expect.extend(toHaveNoViolations)

describe('Label2', () => {
  it('renders text node child', () => {
    const container = render(<Label>Default</Label>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Default')
  })
  it('should have no axe violations', async () => {
    for (const variant in labelColorMap) {
      const {container} = render(<Label variant={variant as LabelColorOptions}>Default</Label>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    }
  })
})
