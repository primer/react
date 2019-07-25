/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import React from 'react'
import Details from '../Details'
import {mount, render} from '../utils/testing'
import {COMMON} from '../constants'

describe('Details', () => {
  it('implements system props', () => {
    expect(Details).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Details).toSetDefaultTheme()
  })

  /*The way that Enzyme handles simulated events is not 1:1 with how the browser handles the same events.
    Because of that, this test is pretty much impossible to implement. When the toggle function
    fires in the test, the native `details` open state has already been updated, which is
    not the case in the browser. Leaving this test disabled for now.
   */
  xit('Can be toggled', () => {
    const wrapper = mount(<Details>{({open}) => <summary>{open ? 'close' : 'open'}</summary>}</Details>)

    const dom = wrapper.getDOMNode()
    const summary = wrapper.find('summary')
    const details = wrapper.find('details')

    expect(dom.hasAttribute('open')).toEqual(false)
    expect(summary.text()).toEqual('open')

    details.simulate('toggle')

    wrapper.update()
    expect(dom.hasAttribute('open')).toEqual(true)
    expect(summary.text()).toEqual('close')

    details.simulate('toggle')

    wrapper.update()
    expect(dom.hasAttribute('open')).toEqual(false)
    expect(summary.text()).toEqual('open')

    wrapper.unmount()
  })
})
