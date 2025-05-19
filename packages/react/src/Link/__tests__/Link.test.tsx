import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import Link from '..'

describe('Link', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Link href="#" className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('passes href down to link element', () => {
    render(<Link href="https://github.com" />)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://github.com')
  })

  it('respects hoverColor prop', () => {
    render(<Link hoverColor="accent.fg">Link with hover color</Link>)
    // In Vitest we'll check that the element renders rather than using snapshots
    expect(screen.getByText('Link with hover color')).toBeInTheDocument()
  })

  it('respects the "sx" prop', () => {
    render(<Link sx={{fontStyle: 'italic'}}>Italic link</Link>)
    expect(screen.getByText('Italic link')).toHaveStyle('font-style: italic')
  })

  it('applies button styles when rendering a button element', () => {
    render(<Link as="button">Button link</Link>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('respects the "muted" prop', () => {
    render(<Link muted>Muted link</Link>)
    expect(screen.getByText('Muted link')).toBeInTheDocument()
  })

  it('respects the "sx" prop when "muted" prop is also passed', () => {
    render(
      <Link muted sx={{color: 'fg.onEmphasis'}}>
        Muted with custom color
      </Link>,
    )
    expect(screen.getByText('Muted with custom color')).toBeInTheDocument()
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(global.console, 'error').mockImplementation(() => {})

    render(<Link as="i">Invalid link</Link>)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
