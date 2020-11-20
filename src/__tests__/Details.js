import React, {useContext} from 'react'
import {Details, Button} from '..'
import {mount, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Details', () => {
  behavesAsComponent(Details, [COMMON])

  checkExports('Details', {
    default: Details
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Details />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  /*The way that Enzyme handles simulated events is not 1:1 with how the browser handles the same events.
    Because of that, this test is pretty much impossible to implement. When the toggle function
    fires in the test, the native `details` open state has already been updated, which is
    not the case in the browser. Leaving this test disabled for now.
   */
  it.skip('Can be toggled', () => {
    const wrapper = mount(
      <Details>
        <summary>button</summary>}
      </Details>
    )

    const dom = wrapper.getDOMNode()
    const summary = wrapper.find('summary')
    const details = wrapper.find('details')

    expect(dom.hasAttribute('open')).toEqual(false)

    details.simulate('toggle')

    wrapper.update()
    expect(dom.hasAttribute('open')).toEqual(true)

    details.simulate('toggle')

    wrapper.update()
    expect(dom.hasAttribute('open')).toEqual(false)

    summary.simulate('click')
  })

  it('Toggles when you click outside', () => {
    const wrapper = mount(<Details>{<summary>button</summary>}</Details>)

    document.body.click()

    const dom = wrapper.getDOMNode()

    expect(dom.hasAttribute('open')).toEqual(false)

    wrapper.unmount()
  })

  it('Accurately passes down open state', () => {
    const MyButton = () => {
      const detailsContext = useContext(Details.Context)
      return <Button as="summary">{detailsContext.open ? 'Open' : 'Closed'}</Button>
    }
    const wrapper = mount(
      <Details>
        <MyButton />
      </Details>
    )

    document.body.click()

    const dom = wrapper.getDOMNode()
    const summary = wrapper.find('summary')
    expect(summary.text()).toEqual('Closed')

    expect(dom.hasAttribute('open')).toEqual(false)

    wrapper.unmount()
  })

  it('Allows context to manipulate state', () => {
    const MyButton = () => {
      const detailsContext = useContext(Details.Context)
      return <Button as="summary">{detailsContext.open ? 'Open' : 'Closed'}</Button>
    }

    const CloseButton = () => {
      const detailsContext = useContext(Details.Context)
      return <Button onClick={detailsContext.setOpen(false)} />
    }

    const wrapper = mount(
      <Details>
        <MyButton />
        <CloseButton />
      </Details>
    )

    wrapper.find(CloseButton).simulate('click')

    const dom = wrapper.getDOMNode()
    const summary = wrapper.find('summary')
    expect(summary.text()).toEqual('Closed')

    expect(dom.hasAttribute('open')).toEqual(false)

    wrapper.unmount()
  })

  it.skip('Does not toggle or prevent click events when you click inside', () => {
    const wrapper = mount(
      <Details open>
        <summary>hi</summary>
        <div>content</div>
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
