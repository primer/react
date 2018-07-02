import React from 'react'
import Details from '../Details'
import {mount, render} from '../utils/testing'

describe('Details', () => {
  it('Renders a <details> element with reset class', () => {
    expect(render(<Details />)).toEqual(render(<details open={false} className="details-reset" />))
  })

  it('Respects the open prop', () => {
    expect(render(<Details open />)).toEqual(render(<details open className="details-reset" />))
  })

  it('Renders children as-is', () => {
    expect(render(<Details>hi</Details>)).toEqual(
      render(
        <details open={false} className="details-reset">
          hi
        </details>
      )
    )
    expect(
      render(
        <Details>
          <summary>hi</summary>bye
        </Details>
      )
    ).toEqual(
      render(
        <details open={false} className="details-reset">
          <summary>hi</summary>bye
        </details>
      )
    )
  })

  it('Renders with a render prop', () => {
    expect(render(<Details render={() => 'hi'} />)).toEqual(
      render(
        <details open={false} className="details-reset">
          hi
        </details>
      )
    )
  })

  it('Renders with children as a function', () => {
    expect(render(<Details>{() => 'hi'}</Details>)).toEqual(
      render(
        <details open={false} className="details-reset">
          hi
        </details>
      )
    )
  })

  it('Passes open state to render function', () => {
    const renderOpenAsString = ({open}) => String(open)
    expect(render(<Details>{renderOpenAsString}</Details>)).toEqual(
      render(
        <details open={false} className="details-reset">
          false
        </details>
      )
    )
    expect(render(<Details open>{renderOpenAsString}</Details>)).toEqual(
      render(
        <details open className="details-reset">
          true
        </details>
      )
    )
  })

  it('Can be toggled', () => {
    const wrapper = mount(
      <Details open={false}>{
        ({open, toggle}) => (
          <summary onClick={toggle}>{open ? 'close' : 'open'}</summary>
        )
      }</Details>
    )

    /**
     * XXX note: when using the react element wrapper, the
     * selector '[open]' doesn't properly resolve the presence
     * of the 'open' HTML attribute. To get around this, we have
     * to test the underlying DOM node's actual 'open'
     * attribute.
     */
    const dom = wrapper.getDOMNode()
    const summary = wrapper.find('summary')

    expect(dom.hasAttribute('open')).toEqual(false)
    expect(summary.text()).toEqual('open')

    summary.simulate('click')

    expect(dom.hasAttribute('open')).toEqual(true)
    expect(summary.text()).toEqual('close')

    summary.simulate('click')

    expect(dom.hasAttribute('open')).toEqual(false)
    expect(summary.text()).toEqual('open')

    wrapper.unmount()
  })
})
