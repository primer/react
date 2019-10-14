import React from 'react'
import TextInput from '../TextInput'
import {render, mount} from '../utils/testing'
import {COMMON} from '../constants'

describe('TextInput', () => {
  it('implements system props', () => {
    expect(TextInput).toImplementSystemProps(COMMON)
  })

  it('renders', () => {
    expect(render(<TextInput name="zipcode" />)).toMatchSnapshot()
  })

  it('renders small', () => {
    expect(render(<TextInput name="zipcode" variant="small" />)).toMatchSnapshot()
  })

  it('has default theme', () => {
    expect(TextInput).toSetDefaultTheme()
  })

  it('renders large', () => {
    expect(render(<TextInput name="zipcode" variant="large" />)).toMatchSnapshot()
  })

  it('renders block', () => {
    expect(render(<TextInput name="zipcode" block />)).toMatchSnapshot()
  })

  it('should call onChange prop with input value', () => {
    const onChangeMock = jest.fn()
    const component = mount(<TextInput onChange={onChangeMock} value="test" />)
    component.find('input').simulate('change')
    expect(onChangeMock).toHaveBeenCalled()
  })
})
