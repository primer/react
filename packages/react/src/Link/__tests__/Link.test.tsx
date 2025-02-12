import React from 'react'
import Link from '..'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'
import {FeatureFlags} from '../../FeatureFlags'

describe('Link', () => {
  behavesAsComponent({Component: Link})

  checkExports('Link', {
    default: Link,
  })

  it('should support `className` on the outermost element', () => {
    const Element = () => <Link href="#" className={'test-class-name'} />
    const FeatureFlagElement = () => {
      return (
        <FeatureFlags
          flags={{
            primer_react_css_modules_staff: true,
            primer_react_css_modules_ga: true,
          }}
        >
          <Element />
        </FeatureFlags>
      )
    }
    expect(HTMLRender(<Element />).container.firstChild).toHaveClass('test-class-name')
    expect(HTMLRender(<FeatureFlagElement />).container.firstChild).toHaveClass('test-class-name')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Link href="www.github.com">GitHub</Link>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
  })

  it('respects hoverColor prop', () => {
    expect(render(<Link hoverColor="accent.fg" />)).toMatchSnapshot()
  })

  it('respects the "sx" prop', () => {
    expect(render(<Link sx={{fontStyle: 'italic'}} />)).toHaveStyleRule('font-style', 'italic')
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
    const consoleSpy = jest.spyOn(global.console, 'error').mockImplementation()

    HTMLRender(<Link as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
