import React from 'react'
import TextInput from '../TextInput'
import {render, mount} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from "@testing-library/react";
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('TextInput', () => {
  it('implements system props', () => {
    expect(TextInput).toImplementSystemProps(COMMON)
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<TextInput aria-label="zipcode" name="zipcode" variant="small" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
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

  it('should render a password input', () => {
    expect(render(<TextInput name="password" type="password" />)).toMatchSnapshot()
  })
})
