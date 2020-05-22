import React from 'react'
import {Link} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON, TYPOGRAPHY} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Link', () => {
  behavesAsComponent(Link, [COMMON, TYPOGRAPHY])

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
    expect(render(<Link hoverColor="blue.4" />)).toMatchSnapshot()
  })

  it('respects the "fontStyle" prop', () => {
    expect(render(<Link fontStyle="italic" />)).toHaveStyleRule('font-style', 'italic')
    expect(render(<Link as="i" fontStyle="normal" />)).toHaveStyleRule('font-style', 'normal')
  })

  it('applies button styles when rendering a button element', () => {
    expect(render(<Link as="button" />)).toMatchSnapshot()
  })

  it('respectes the "muted" prop', () => {
    expect(render(<Link muted />)).toMatchSnapshot()
  })

  it('respectes the "color" prop when "muted" prop is also passed', () => {
    expect(render(<Link muted color="black" />)).toMatchSnapshot()
  })
})
