import React from 'react'
import TextInput from '../TextInput'
import {render} from '../utils/testing'

describe('TextInput', () => {
  it('renders', () => {
    expect(render(<TextInput name='zipcode' />))
      .toEqual(render(<input name='zipcode' type='text' className='form-control' autocomplete='off' />))
  })

  it('renders small', () => {
    expect(render(<TextInput name='zipcode' size='small' />))
      .toEqual(render(<input name='zipcode' type='text' className='form-control input-sm' autocomplete='off' />))
  })

  it('renders large', () => {
    expect(render(<TextInput name='zipcode' size='large' />))
      .toEqual(render(<input name='zipcode' type='text' className='form-control input-lg' autocomplete='off' />))
  })

  it('renders block', () => {
    expect(render(<TextInput name='zipcode' block />))
      .toEqual(render(<input name='zipcode' type='text' className='form-control input-block' autocomplete='off' />))
  })
})
