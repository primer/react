import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {fireEvent, render} from '@testing-library/react'
import {CodeIcon, EyeIcon} from '@primer/octicons-react'

import {UnderlineNav} from '.'

// window.matchMedia() is not implemented by JSDOM so we have to create a mock:
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

Object.defineProperty(window.Element.prototype, 'scrollTo', {
  value: jest.fn(),
  writable: true
})
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
  test('with icons', () => {
    const {container} = render(
      <UnderlineNav label="Test nav">
        <UnderlineNav.Item icon={CodeIcon}>Code</UnderlineNav.Item>
        <UnderlineNav.Item icon={EyeIcon} counter={6}>
          Issues
        </UnderlineNav.Item>
        <UnderlineNav.Item>Pull Request</UnderlineNav.Item>
      </UnderlineNav>
    )
    const nav = container.getElementsByTagName('nav')[0]
    expect(nav.getElementsByTagName('svg').length).toEqual(2)
  })
  test('should fire onSelect on click and keypress', async () => {
    const onSelect = jest.fn()
    const {getByText} = render(
      <UnderlineNav label="Test nav">
        <UnderlineNav.Item onSelect={onSelect}>Item 1</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item onSelect={onSelect}>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    const item = getByText('Item 1')
    fireEvent.click(item)
    expect(onSelect).toHaveBeenCalledTimes(1)
    fireEvent.keyPress(item, {key: 'Enter', code: 13, charCode: 13})
    expect(onSelect).toHaveBeenCalledTimes(2)
  })
  test('respect counter prop', () => {
    const {getByText} = render(
      <UnderlineNav label="Test nav" align="right">
        <UnderlineNav.Item counter={8} selected>
          Item 1
        </UnderlineNav.Item>
        <UnderlineNav.Item>Item 2</UnderlineNav.Item>
        <UnderlineNav.Item>Item 3</UnderlineNav.Item>
      </UnderlineNav>
    )
    const item = getByText('Item 1').closest('a')
    const counter = item?.getElementsByTagName('span')[2]
    expect(counter?.className).toContain('CounterLabel')
    expect(counter?.textContent).toBe('8')
  })
})
