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
    const {container} = HTMLRender(render(<Link href="https://github.com" />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('respects hoverColor prop', () => {
    const {container} = HTMLRender(render(<Link hoverColor="accent.fg" />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('respects the "sx" prop', () => {
    expect(render(<Link sx={{fontStyle: 'italic'}} />)).toHaveStyleRule('font-style', 'italic')
  })

  it('applies button styles when rendering a button element', () => {
    const {container} = HTMLRender(render(<Link as="button" />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('respects the "muted" prop', () => {
    const {container} = HTMLRender(render(<Link muted />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('respects the  "sx" prop when "muted" prop is also passed', () => {
    const {container} = HTMLRender(render(<Link muted sx={{color: 'fg.onEmphasis'}} />))
    expect(container.firstChild).toBeInTheDocument()
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation()

    HTMLRender(<Link as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
