import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {Header} from '..'

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

  it('renders a <header> and <a>', () => {
    const {container: headerContainer} = render(<Header />)
    const {container: linkContainer} = render(<Header.Link />)
    expect((headerContainer.firstChild as Element).tagName).toEqual('HEADER')
    expect((linkContainer.firstChild as Element).tagName).toEqual('A')
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
