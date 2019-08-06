/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react'
import Details from '../Details'
import {mount, render} from '../utils/testing'
import {COMMON} from '../constants'

describe('Details', () => {
  it('implements system props', () => {
    expect(Details).toImplementSystemProps(COMMON)
  })

  it('Respects the open prop', () => {
    expect(mount(<Details open />).props().open).toEqual(true)
  })

  it('has default theme', () => {
    expect(Details).toSetDefaultTheme()
  })

  xit('Renders children as-is', () => {
    expect(render(<Details>hi</Details>)).toEqual(render(<details open={false}>hi</details>))
    expect(
      render(
        <Details>
          <summary>hi</summary>
          bye
        </Details>
      )
    ).toEqual(
      render(
        <details open={false}>
          <summary>hi</summary>
          bye
        </details>
      )
    )
  })

  xit('Renders with a render prop', () => {
    expect(render(<Details render={() => 'hi'} />)).toEqual(render(<details open={false}>hi</details>))
  })

  xit('Renders with children as a function', () => {
    expect(render(<Details>{() => 'hi'}</Details>)).toEqual(render(<details open={false}>hi</details>))
  })

  xit('Passes open state to render function', () => {
    const renderOpenAsString = ({open}) => String(open)
    expect(render(<Details>{renderOpenAsString}</Details>)).toEqual(render(<details open={false}>false</details>))
    expect(render(<Details open>{renderOpenAsString}</Details>)).toEqual(render(<details open>true</details>))
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

    summary.simulate('click')
  })

  it('Toggles when you click outside', () => {
    const wrapper = mount(<Details>{({open}) => <summary>{open ? 'close' : 'open'}</summary>}</Details>)

    document.body.click()

    const dom = wrapper.getDOMNode()
    const summary = wrapper.find('summary')

    expect(dom.hasAttribute('open')).toEqual(false)
    expect(summary.text()).toEqual('open')

    wrapper.unmount()
  })

  it('Does not toggle or prevent click events when you click inside', () => {
    const wrapper = mount(
      <Details open>
        {({open}) => (
          <>
            <summary>{open ? 'close' : 'open'}</summary>
            <div>content</div>
          </>
        )}
      </Details>
    )

    document.body.click()

    const dom = wrapper.getDOMNode()
    const content = dom.querySelector('div')

    let clickEvent
    content.addEventListener('click', event => (clickEvent = event))
    content.click()

    expect(dom.hasAttribute('open')).toEqual(true)
    expect(clickEvent.defaultPrevented).toBe(false)

    wrapper.unmount()
  })
})
