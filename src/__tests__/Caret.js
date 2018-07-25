import React from 'react'
import Caret from '../Caret'
import {colors} from '../theme'
import {mount, render} from '../utils/testing'

describe('Caret', () => {
  it('renders <svg>', () => {
    expect(render(<Caret />).type).toEqual('svg')
  })

  it('renders cardinal directions', () => {
    for (const location of ['top', 'right', 'bottom', 'left']) {
      expect(render(<Caret location={location} />)).toMatchSnapshot()
    }
    for (const location of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
      expect(render(<Caret location={location} />)).toMatchSnapshot()
    }
    for (const location of ['left-top', 'left-bottom', 'right-top', 'right-bottom']) {
      expect(render(<Caret location={location} />)).toMatchSnapshot()
    }
  })

  it('maps border colors', () => {
    const wrapper = mount(<Caret borderColor="red" />)
    expect(wrapper.find('path[stroke]').props().stroke).toEqual(colors.border.red)
  })

  it('renders unknown borderColor as-is', () => {
    const hush = jest.spyOn(console, 'error').mockImplementation(jest.fn())
    const wrapper = mount(<Caret borderColor="#f0f" />)
    expect(wrapper.find('path[stroke]').props().stroke).toEqual('#f0f')
    hush.mockRestore()
  })
})
