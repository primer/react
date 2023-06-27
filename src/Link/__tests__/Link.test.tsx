import React from 'react'
import Link from '..'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe} from 'jest-axe'

describe('Link', () => {
  behavesAsComponent({Component: Link, options: {skipAs: true}})

  checkExports('Link', {
    default: Link,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Link href="www.github.com">GitHub</Link>)
    const results = await axe(container)
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

  it('respects the "muted" prop', () => {
    expect(render(<Link muted />)).toMatchSnapshot()
  })

  it('respects the  "sx" prop when "muted" prop is also passed', () => {
    expect(render(<Link muted sx={{color: 'fg.onEmphasis'}} />)).toMatchSnapshot()
  })
})
