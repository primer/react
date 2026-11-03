import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import Header from '.'
import {implementsClassName} from '../utils/testing'
import classes from './Header.module.css'

describe('Header', () => {
  implementsClassName(Header, classes.Header)
  it('renders data-component attributes', async () => {
    const {container: headerContainer} = render(<Header />)
    await expect.element(headerContainer.firstChild as HTMLElement).toHaveAttribute('data-component', 'Header')

    const {container: itemContainer} = render(<Header.Item />)
    await expect.element(itemContainer.firstChild as HTMLElement).toHaveAttribute('data-component', 'Header.Item')

    const {container: linkContainer} = render(<Header.Link />)
    await expect.element(linkContainer.firstChild as HTMLElement).toHaveAttribute('data-component', 'Header.Link')
  })
  describe('Header.Item', () => {
    implementsClassName(Header.Item, classes.HeaderItem)
    it('accepts and applies className', async () => {
      const {container} = render(<Header.Item className="primer" />)
      await expect.element(container.firstChild as HTMLElement).toHaveClass('primer')
    })
  })

  describe('Header.Link', () => {
    implementsClassName(Header.Link, classes.HeaderLink)
  })

  it('renders a <header> and <a>', () => {
    const {container: headerContainer} = render(<Header />)
    const {container: linkContainer} = render(<Header.Link />)
    expect((headerContainer.firstChild as Element).tagName).toEqual('HEADER')
    expect((linkContainer.firstChild as Element).tagName).toEqual('A')
  })

  it('sets aria-label appropriately', async () => {
    const {container} = render(<Header aria-label="Test label" />)
    await expect.element(container.firstChild as HTMLElement).toHaveAttribute('aria-label', 'Test label')
  })
})
