import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import Header from '../Header'
import axe from 'axe-core'

describe('Header', () => {
  describe('Header.Item', () => {
    it('accepts and applies className', () => {
      const {container} = render(<Header.Item className="primer" />)
      expect(container.firstChild).toHaveClass('primer')
    })

    it('should support `className` on the outermost element', () => {
      const Element = () => <Header.Item className={'test-class-name'} />
      expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  describe('Header.Link', () => {
    it('should support `className` on the outermost element', () => {
      const Element = () => <Header.Link className={'test-class-name'} />
      expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  it('renders a <div> and <a>', () => {
    expect(render(<Header />).container.firstElementChild?.tagName).toEqual('HEADER')
    expect(render(<Header.Link />).container.firstElementChild?.tagName).toEqual('A')
  })

  it('sets aria-label appropriately', () => {
    const {container} = render(<Header aria-label="Test label" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'Test label')
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Header className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
})
