import React from 'react'
import {Check} from '@primer/octicons-react'
import {colors} from '../theme'
import CircleOcticon from '../CircleOcticon'
import {render} from '../utils/testing'

describe('CircleOcticon', () => {
  it('renders a <div> with width and height', () => {
    const result = render(<CircleOcticon icon={Check} size={10} />)
    expect(result).toHaveStyleRule('width', '10px')
    expect(result).toHaveStyleRule('height', '10px')
  })

  xit('has default theme', () => {
    expect(CircleOcticon).toSetDefaultTheme()
  })

  it('renders {borderRadius: 50%}', () => {
    expect(render(<CircleOcticon icon={Check} />)).toHaveStyleRule('border-radius', '50%')
  })

  it('respects the bg prop', () => {
    expect(render(<CircleOcticon icon={Check} bg="red.5" />)).toHaveStyleRule('background-color', colors.red[5])
  })

  it('has a default size', () => {
    const result = render(<CircleOcticon icon={Check} />)
    expect(result).toHaveStyleRule('width', '32px')
    expect(result).toHaveStyleRule('height', '32px')
  })

  it('respects the "as" prop', () => {
    expect(render(<CircleOcticon icon={Check} as="span" />).type).toEqual('span')
  })
})
