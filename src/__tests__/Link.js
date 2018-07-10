/* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from '../Link'
import {render, renderClasses} from '../utils/testing'

describe('Link', () => {
  it('renders an <a> with "text-blue" by default', () => {
    expect(render(<Link />)).toEqual(render(<a className="text-blue" />))
  })

  it('respects the "muted" prop', () => {
    expect(renderClasses(<Link muted />)).toEqual(['muted-link'])
  })

  it('respects the "scheme" prop', () => {
    expect(renderClasses(<Link scheme="gray" />)).toEqual(['link-gray'])
    expect(renderClasses(<Link scheme="gray-dark" />)).toEqual(['link-gray-dark'])
  })

  it('respects the "nounderline" prop', () => {
    expect(renderClasses(<Link nounderline />)).toEqual(['text-blue', 'no-underline'])
  })
})
