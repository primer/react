/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import Avatar from '../Avatar'
import {render, renderClasses} from '../utils/testing'

describe('Avatar', () => {
  it('renders small by default', () => {
    expect(renderClasses(<Avatar />)).toContain('avatar-small')
  })

  it('respects the size prop', () => {
    expect(render(<Avatar size={40} alt="github" />)).toMatchSnapshot()
  })

  it('respects isChild', () => {
    expect(renderClasses(<Avatar isChild />)).toContain('avatar-child')
  })

  it('passes through the src prop', () => {
    expect(render(<Avatar src="primer.png" />)).toMatchSnapshot()
  })
})
