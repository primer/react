import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import Link from '../Link'

describe('Link', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Link href="#" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('passes href down to link element', () => {
    const {container} = render(<Link href="https://github.com" />)
    expect(container.firstChild).toHaveAttribute('href', 'https://github.com')
  })

  it('respects hoverColor prop', () => {
    const {container} = render(<Link hoverColor="accent.fg" />)
    expect(container.firstChild).toHaveStyle('--fgColor-accent: #0969da')
  })

  it('respects the "sx" prop', () => {
    const {container} = render(<Link sx={{fontStyle: 'italic'}} />)
    expect(container.firstChild).toHaveStyle('font-style: italic')
  })

  it('applies button styles when rendering a button element', () => {
    const {container} = render(<Link as="button" />)
    expect((container.firstChild as Element).tagName).toBe('BUTTON')
  })

  it('respects the "muted" prop', () => {
    const {container} = render(<Link muted />)
    expect(container.firstChild).toHaveAttribute('data-muted', 'true')
  })

  it('respects the "sx" prop when "muted" prop is also passed', () => {
    const {container} = render(<Link muted sx={{color: 'fg.onEmphasis'}} />)
    expect(container.firstChild).toHaveAttribute('data-muted', 'true')
    expect(container.firstChild).toHaveStyle('color: rgb(89, 99, 110)')
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(globalThis.console, 'error').mockImplementation(() => {})

    render(<Link as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
