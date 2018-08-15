/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import Avatar from '../Avatar'
import theme from '../theme'
import {px, render, renderClasses, renderStyles, loadCSS, unloadCSS} from '../utils/testing'

const STYLE_PATH = 'primer-avatars/build/build.css'

beforeAll(() => {
  return loadCSS(STYLE_PATH)
})

afterAll(() => unloadCSS(STYLE_PATH))

describe('Avatar', () => {
  it('is a system component', () => {
    expect(Avatar.systemComponent).toEqual(true)
  })

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
