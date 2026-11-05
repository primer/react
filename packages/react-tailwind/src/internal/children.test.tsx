import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {flattenChildren} from './children'

describe('flattenChildren', () => {
  it('unwraps fragments so nested parts are discoverable', () => {
    const result = flattenChildren(
      <>
        <span>one</span>
        <>
          <span>two</span>
          <span>three</span>
        </>
      </>,
    )

    expect(result).toHaveLength(3)
  })

  it('preserves non-fragment children and ignores empty values', () => {
    const result = flattenChildren([<span key="a">a</span>, null, undefined, false, 'text'])

    expect(result).toHaveLength(2)
  })

  it('keeps keys unique once fragment children are flattened beside their siblings', () => {
    const result = flattenChildren([
      <span key="group">group</span>,
      <React.Fragment key="extra">
        <span>divider</span>
        <span>item</span>
      </React.Fragment>,
      React.createElement(React.Fragment, null, <span>first</span>),
    ])
    const keys = result.map(child => (React.isValidElement(child) ? child.key : null))

    expect(new Set(keys).size).toBe(keys.length)
  })

  it('returns children that still render in order', () => {
    render(
      <div data-testid="root">
        {flattenChildren(
          <>
            <span>first</span>
            <>
              <span>second</span>
            </>
          </>,
        )}
      </div>,
    )

    expect(screen.getByTestId('root')).toHaveTextContent('firstsecond')
  })
})
