/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react'
import Details from '../Details'
import {mount, render} from '../utils/testing'

describe('Details', () => {
  it('Respects the open prop', () => {
    expect(mount(<Details open />).props().open).toEqual(true)
  })

  xit('Renders children as-is', () => {
    expect(render(mount(<Details>hi</Details>))).toEqual(render(<details open={false}>hi</details>))
    expect(
      render(
        <Details>
          <summary>hi</summary>
          bye
        </Details>
      )
    ).toEqual(
      render(mount(
        <details open={false}>
          <summary>hi</summary>
          bye
        </details>
      ))
    )
  })

  xit('Renders with a render prop', () => {
    expect(render(mount(<Details render={() => 'hi'} />))).toEqual(render(<details open={false}>hi</details>))
  })

  xit('Renders with children as a function', () => {
    expect(render(mount(<Details>{() => 'hi'}</Details>))).toEqual(render(<details open={false}>hi</details>))
  })

  xit('Passes open state to render function', () => {
    const renderOpenAsString = ({open}) => String(open)
    expect(render(mount(<Details>{renderOpenAsString}</Details>))).toEqual(render(<details open={false}>false</details>))
    expect(render(mount(<Details open>{renderOpenAsString}</Details>))).toEqual(render(<details open>true</details>))
  })

  it('Can be toggled', () => {
    const wrapper = mount(
      <Details open={false}>
        {({open, toggle}) => <summary onClick={toggle}>{open ? 'close' : 'open'}</summary>}
      </Details>
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
