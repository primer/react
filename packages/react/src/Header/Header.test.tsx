import React from 'react'
import {describe, expect, it} from 'vitest'
import {Header} from '..'
import {render as HTMLRender} from '@testing-library/react'

describe('Header', () => {
  describe('Header.Item', () => {
    it('should support `className` on the outermost element', () => {
      const Element = () => <Header.Item className={'test-class-name'} />
      expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  describe('Header.Link', () => {
    it('should support `className` on the outermost element', () => {
      const Element = () => <Header.Link className={'test-class-name'} />
      expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  it('renders a <header> element', () => {
    const {container} = HTMLRender(<Header />)
    expect(container.firstChild?.nodeName).toEqual('HEADER')
  })

  it('renders an <a> for Header.Link', () => {
    const {container} = HTMLRender(<Header.Link />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('sets aria-label appropriately', () => {
    const {container} = HTMLRender(<Header aria-label="Test label" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'Test label')
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Header className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
})
