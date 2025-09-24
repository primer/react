import {describe, expect, it, vi} from 'vitest'
import {Heading} from '../..'
import {render, screen} from '@testing-library/react'

describe('Heading', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Heading className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders <h2> by default', () => {
    const {container} = render(<Heading />)
    const heading = container.firstChild as HTMLElement
    expect(heading.tagName).toBe('H2')
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})

    // @ts-expect-error as prop should not be accepted
    render(<Heading as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  // How can we test for generated class names?
  it.skip('should only include css modules class', () => {
    render(<Heading>test</Heading>)
    expect(screen.getByText('test')).toHaveClass('prc-Heading-Heading-6CmGO')
    // Note: this is the generated class name when CSS modules is used
    // for this component
    expect(screen.getByText('test')).not.toHaveClass(/^Heading__StyledHeading/)
  })
})
