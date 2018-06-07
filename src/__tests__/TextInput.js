import React from 'react'
import TextInput from '../TextInput'
import {render} from '../utils/testing'

describe('TextInput', () => {
  it('renders', () => {
    expect(render(<TextInput />))
      .toEqual(render(<input type='text' className='form-control' autocomplete='off' />))
  })

  it('renders small', () => {
    expect(render(<TextInput size='small' />))
      .toEqual(render(<input type='text' className='form-control input-sm' autocomplete='off' />))
  })

  it('renders large', () => {
    expect(render(<TextInput size='large' />))
      .toEqual(render(<input type='text' className='form-control input-lg' autocomplete='off' />))
  })

  it('renders block', () => {
    expect(render(<TextInput block />))
      .toEqual(render(<input type='text' className='form-control input-block' autocomplete='off' />))
  })
})
