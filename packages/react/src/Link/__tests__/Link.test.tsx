import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import Link from '..'

describe('Link', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Link href="#" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
  })

  it('respects hoverColor prop', () => {
    expect(render(<Link hoverColor="accent.fg" />)).toMatchSnapshot()
  })

  it('applies button styles when rendering a button element', () => {
    expect(render(<Link as="button" />)).toMatchSnapshot()
  })

  it('respects the "muted" prop', () => {
    expect(render(<Link muted />)).toMatchSnapshot()
  })

  it('respects the  "sx" prop when "muted" prop is also passed', () => {
    expect(render(<Link muted sx={{color: 'fg.onEmphasis'}} />)).toMatchSnapshot()
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<Link as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
