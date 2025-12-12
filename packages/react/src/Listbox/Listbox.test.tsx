import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import Listbox from '.'

describe('Listbox', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Listbox className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders default text content', () => {
    const rendered = render(<Listbox />)
    expect(rendered.container.textContent).toEqual('Listbox Component')
  })

  it('renders custom children', () => {
    const {getByText} = render(<Listbox>Custom content</Listbox>)
    expect(getByText('Custom content')).toBeInTheDocument()
  })

  it('renders as a div by default', () => {
    const {container} = render(<Listbox />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('can render as a different element', () => {
    const {container} = render(<Listbox as="section" />)
    expect(container.firstChild?.nodeName).toBe('SECTION')
  })
})
