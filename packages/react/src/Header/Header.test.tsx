import {describe, expect, it} from 'vitest'
import {Header} from '..'
import {render} from '@testing-library/react'
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

  it('should have no axe violations', async () => {
    const {container} = render(
      <Header>
        <Header.Item full>
          <Header.Link href="#">One</Header.Link>
        </Header.Item>
        <Header.Item>
          <Header.Link href="#">Two</Header.Link>
        </Header.Item>
        <Header.Item>Three</Header.Item>
      </Header>,
    )
    const results = await axe.run(container)
    expect(results.violations).toEqual([])
  })

  it('renders a <header> and <a>', () => {
    const {container: headerContainer} = render(<Header />)
    const {container: linkContainer} = render(<Header.Link />)

    expect(headerContainer.firstChild?.nodeName.toLowerCase()).toEqual('header')
    expect(linkContainer.firstChild?.nodeName.toLowerCase()).toEqual('a')
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
