import React from 'react'
import {render, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
import {Label, variants, LabelColorOptions} from '../Label2'
import {renderStyles} from '../utils/testing'
expect.extend(toHaveNoViolations)

describe('Label2', () => {
  it('renders text node child', () => {
    const container = render(<Label>Default</Label>)
    const label = container.baseElement
    expect(label.textContent).toEqual('Default')
  })
  it('default size is rendered as "small"', () => {
    const expectedStyles = {
      height: '20px',
      padding: '0 7px'
    }
    const defaultStyles = renderStyles(<Label />)

    expect(defaultStyles).toEqual(expect.objectContaining(expectedStyles))
  })
  it('default variant is rendered as "default"', () => {
    const expectedStyles = {
      ['border-color']: '#d0d7de'
    }
    const defaultStyles = renderStyles(<Label />)

    expect(defaultStyles).toEqual(expect.objectContaining(expectedStyles))
  })
  it('should have no axe violations', async () => {
    for (const variant in variants) {
      const {container} = render(<Label variant={variant as LabelColorOptions}>Default</Label>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
      cleanup()
    }
  })
})
