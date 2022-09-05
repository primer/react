import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'

import {UnderlineNav} from '.'

describe('UnderlineNav', () => {
  test('selected nav', () => {
    const {getByText} = render(
      <UnderlineNav label="Test nav">
        <UnderlineNav.Item selected>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    const selectedNavLink = getByText('Item 1').closest('a')

    expect(selectedNavLink?.getAttribute('aria-current')).toBe('page')
  })
  test('basic nav functionality', () => {
    const {container} = render(
      <UnderlineNav label="Test nav">
        <UnderlineNav.Item selected>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    expect(container.getElementsByTagName('nav').length).toEqual(1)
    const nav = container.getElementsByTagName('nav')[0]

    expect(nav.getAttribute('aria-label')).toBe('Test nav')
  })
  test('respect align prop', () => {
    const {container} = render(
      <UnderlineNav label="Test nav" align="right">
        <UnderlineNav.Item selected>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    const nav = container.getElementsByTagName('nav')[0]
    expect(nav).toHaveStyle(`justify-content:flex-end`)
  })
})
