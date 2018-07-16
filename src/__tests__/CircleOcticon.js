import React from 'react'
import CircleOcticon from '../CircleOcticon'
import {render, rendersClass} from '../utils/testing'
import {Check} from '@githubprimer/octicons-react'

describe('CircleOcticon', () => {
  it('renders a <div> with width and height', () => {
    expect(render(<CircleOcticon icon={Check} size={10} />).props.style).toEqual({width: '10px', height: '10px'})
  })

  it('adds the "circle" class', () => {
    expect(rendersClass(<CircleOcticon icon={Check} />, 'circle')).toBe(true)
  })

  it('does not add a bg class by default', () => {
    expect(render(<CircleOcticon icon={Check} />).props.className).not.toMatch(/\bbg-/)
  })

  it('adds the appropriate bg class for the "bg" prop', () => {
    expect(rendersClass(<CircleOcticon icon={Check} bg="red" />, 'bg-red')).toBe(true)
  })

  it('does not add a text class by default', () => {
    expect(render(<CircleOcticon icon={Check} />).props.className).not.toMatch(/\btext-/)
  })

  it('adds the appropriate text class for the "color" prop', () => {
    expect(rendersClass(<CircleOcticon icon={Check} color="red" />, 'text-red')).toBe(true)
  })

  it('has a default size', () => {
    expect(render(<CircleOcticon icon={Check} />).props.style).toEqual({width: '32px', height: '32px'})
  })
})
