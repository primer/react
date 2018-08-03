import React from 'react'
import CircleOcticon from '../CircleOcticon'
import {render, rendersClass} from '../utils/testing'
import {Check} from '@githubprimer/octicons-react'

describe('CircleOcticon', () => {
  it('renders a <div> with width and height', () => {
    const result = render(<CircleOcticon icon={Check} size={10} />)
    expect(result).toHaveStyleRule('width', '10px')
    expect(result).toHaveStyleRule('height', '10px')
  })

  xit('adds the "circle" class', () => {
    expect(rendersClass(<CircleOcticon icon={Check} />, 'circle')).toBe(true)
  })

  xit('does not add a bg class by default', () => {
    expect(render(<CircleOcticon icon={Check} />).props.className).not.toMatch(/\bbg-/)
  })

  xit('adds the appropriate bg class for the "bg" prop', () => {
    expect(rendersClass(<CircleOcticon icon={Check} bg="red" />, 'bg-red')).toBe(true)
  })

  xit('does not add a text class by default', () => {
    expect(render(<CircleOcticon icon={Check} />).props.className).not.toMatch(/\btext-/)
  })

  xit('adds the appropriate text class for the "color" prop', () => {
    expect(rendersClass(<CircleOcticon icon={Check} color="red" />, 'text-red')).toBe(true)
  })

  it('has a default size', () => {
    const result = render(<CircleOcticon icon={Check} />)
    expect(result).toHaveStyleRule('width', '32px')
    expect(result).toHaveStyleRule('height', '32px')
  })

  it('respects margin utility prop', () => {
    expect(render(<CircleOcticon icon={Check} m={4} />)).toHaveStyleRule('margin', '32px')
  })

  it('respects padding utility prop', () => {
    expect(render(<CircleOcticon icon={Check} p={4} />)).toHaveStyleRule('padding', '32px')
  })
})
