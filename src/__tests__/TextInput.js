import React from 'react'
import TextInput from '../TextInput'
import {render, mount} from '../utils/testing'
import {COMMON} from '../system-props'

describe('TextInput', () => {
  it('implements common system props', () => {
    expect(TextInput).toImplementSystemProps(COMMON)
  })

  it('renders', () => {
    expect(render(mount(<TextInput name="zipcode" />))).toMatchSnapshot()
  })

  it('renders small', () => {
    expect(render(mount(<TextInput name="zipcode" size="small" />))).toMatchSnapshot()
  })

  it('renders large', () => {
    expect(render(mount(<TextInput name="zipcode" size="large" />))).toMatchSnapshot()
  })

  it('renders block', () => {
    expect(render(mount(<TextInput name="zipcode" block />))).toMatchSnapshot()
  })

  it('should call onChange prop with input value', () => {
    const onChangeMock = jest.fn()
    const component = mount(<TextInput onChange={onChangeMock} value="test" />)
    component.find('input').simulate('change')
    expect(onChangeMock).toHaveBeenCalled()
  })
})
