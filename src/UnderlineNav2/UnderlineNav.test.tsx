import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import UnderlineNav from '.'

describe('UnderlineNav', () => {
  test('selected nav', () => {
    const {getByText} = render(
      <UnderlineNav label="Test nav">
        <UnderlineNav.Link selected>Item 1</UnderlineNav.Link>
        <UnderlineNav.Link>Item 2</UnderlineNav.Link>
        <UnderlineNav.Link>Item 3</UnderlineNav.Link>
      </UnderlineNav>
    )
    const selectedNavLink = getByText('Item 1').closest('a')

    expect(selectedNavLink?.getAttribute('aria-current')).toBe('page')
  })
  test('basic nav functionality', () => {
    const {container} = render(
      <UnderlineNav label="Test nav">
        <UnderlineNav.Link selected>Item 1</UnderlineNav.Link>
        <UnderlineNav.Link>Item 2</UnderlineNav.Link>
        <UnderlineNav.Link>Item 3</UnderlineNav.Link>
      </UnderlineNav>
    )
    expect(container.getElementsByTagName('nav').length).toEqual(1)
    const nav = container.getElementsByTagName('nav')[0]

    expect(nav.getAttribute('aria-label')).toBe('Test nav')
  })
  test('respect align prop', () => {
    const {container} = render(
      <UnderlineNav label="Test nav" align="right">
        <UnderlineNav.Link selected>Item 1</UnderlineNav.Link>
        <UnderlineNav.Link>Item 2</UnderlineNav.Link>
        <UnderlineNav.Link>Item 3</UnderlineNav.Link>
      </UnderlineNav>
    )
    const nav = container.getElementsByTagName('nav')[0]
    expect(nav).toHaveStyle(`justify-content:flex-end`)
  })
})
