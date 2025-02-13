import React from 'react'
import {Header} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Header', () => {
  behavesAsComponent({Component: Header})

  checkExports('Header', {
    default: Header,
  })

  describe('Header.Item', () => {
    behavesAsComponent({Component: Header.Item, options: {skipAs: true}})

    it('accepts and applies className', () => {
      expect(render(<Header.Item className="primer" />).props.className).toContain('primer')
    })

    it('should support `className` on the outermost element', () => {
      const Element = () => <Header.Item className={'test-class-name'} />
      expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  describe('Header.Link', () => {
    behavesAsComponent({Component: Header.Link})

    it('should support `className` on the outermost element', () => {
      const Element = () => <Header.Link className={'test-class-name'} />
      expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    })
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
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
    expect(results).toHaveNoViolations()
  })

  it('renders a <div> and <a>', () => {
    expect(render(<Header />).type).toEqual('header')
    expect(render(<Header.Link />).type).toEqual('a')
  })

  it('sets aria-label appropriately', () => {
    expect(render(<Header aria-label="Test label" />).props['aria-label']).toEqual('Test label')
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Header className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
})
