import React from 'react'
import Input from '../Input'
import {render} from '../utils/testing'

describe('Input', () => {
  it('renders', () => {
    expect(render(<Input />))
      .toEqual(render(<input type='text' className='form-control' autocomplete='off' />))
  })

  it('renders small', () => {
    expect(render(<Input small />))
      .toEqual(render(<input type='text' className='form-control input-sm' autocomplete='off' />))
  })

  it('renders large', () => {
    expect(render(<Input large />))
      .toEqual(render(<input type='text' className='form-control input-lg' autocomplete='off' />))
  })

  it('renders block', () => {
    expect(render(<Input block />))
      .toEqual(render(<input type='text' className='form-control input-block' autocomplete='off' />))
  })
})
