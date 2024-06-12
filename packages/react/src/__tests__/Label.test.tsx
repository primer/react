import React from 'react'
import {render} from '@testing-library/react'
import axe from 'axe-core'
import type {LabelColorOptions} from '../Label'
import Label, {variants} from '../Label'
import {renderStyles} from '../utils/testing'

describe('Label', () => {
  it('renders text node child', () => {
    const container = render(<Label>Default</Label>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Default')
  })
  it('default size is rendered as "small"', () => {
    const expectedStyles = {
      height: '20px',
      padding: '0 7px',
    }
    const defaultStyles = renderStyles(<Label />)

    expect(defaultStyles).toEqual(expect.objectContaining(expectedStyles))
  })
  it('default variant is rendered as "default"', () => {
    const expectedStyles = {
      ['border-color']: 'var(--borderColor-default,var(--color-border-default,#d0d7de))',
    }
    const defaultStyles = renderStyles(<Label />)

    expect(defaultStyles).toEqual(expect.objectContaining(expectedStyles))
  })
  it('should have no axe violations', async () => {
    for (const variant in variants) {
      const {container} = render(<Label variant={variant as LabelColorOptions}>Default</Label>)
      const results = await axe.run(container)
      expect(results).toHaveNoViolations()
    }
  })
})
