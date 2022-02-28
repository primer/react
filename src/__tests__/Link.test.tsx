import React from 'react'
import {Link} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Link', () => {
  behavesAsComponent({Component: Link})

  checkExports('Link', {
    default: Link
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Link href="www.github.com">GitHub</Link>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('passes href down to link element', () => {
    expect(render(<Link href="https://github.com" />)).toMatchSnapshot()
  })

  it('respects hoverColor prop', () => {
    expect(render(<Link hoverColor="accent.fg" />)).toMatchSnapshot()
  })

  it('respects the "sx" prop', () => {
    expect(render(<Link sx={{fontStyle: 'italic'}} />)).toHaveStyleRule('font-style', 'italic')
    expect(render(<Link as="i" sx={{fontStyle: 'normal'}} />)).toHaveStyleRule('font-style', 'normal')
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
})
