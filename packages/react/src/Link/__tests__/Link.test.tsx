import Link from '..'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Link', () => {
  behavesAsComponent({Component: Link})

  checkExports('Link', {
    default: Link,
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Link href="#" className={'test-class-name'} />
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Link href="www.github.com">GitHub</Link>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('passes href down to link element', () => {
    const {getByRole} = HTMLRender(<Link href="https://github.com" />)
    expect(getByRole('link')).toHaveAttribute('href', 'https://github.com')
  })

  it('respects hoverColor prop', () => {
    const {getByRole} = HTMLRender(<Link hoverColor="accent.fg" />)
    expect(getByRole('link')).toHaveAttribute('data-hover-color', 'accent.fg')
  })

  it('respects the "sx" prop', () => {
    expect(render(<Link sx={{fontStyle: 'italic'}} />)).toHaveStyleRule('font-style', 'italic')
  })

  it('applies button styles when rendering a button element', () => {
    const {getByRole} = HTMLRender(<Link as="button" />)
    const button = getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button.tagName).toBe('BUTTON')
  })

  it('respects the "muted" prop', () => {
    const {getByRole} = HTMLRender(<Link muted />)
    expect(getByRole('link')).toHaveAttribute('data-muted', 'true')
  })

  it('respects the  "sx" prop when "muted" prop is also passed', () => {
    const {getByRole} = HTMLRender(<Link muted sx={{color: 'fg.onEmphasis'}} />)
    const link = getByRole('link')
    expect(link).toHaveAttribute('data-muted', 'true')
    // When sx prop is used, it renders using Box component
    expect(link).toBeInTheDocument()
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation()

    HTMLRender(<Link as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
