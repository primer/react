import React from 'react'
import StateLabel from '../StateLabel'
import {render, behavesAsComponent} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('StateLabel', () => {
  behavesAsComponent(StateLabel, [COMMON])

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<StateLabel status="issueOpened" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects the status prop', () => {
    expect(render(<StateLabel status="issueOpened" />)).toMatchSnapshot()
    expect(render(<StateLabel status="issueClosed" />)).toMatchSnapshot()
    expect(render(<StateLabel status="pullMerged" />)).toMatchSnapshot()
  })

  it('has default theme', () => {
    expect(StateLabel).toSetDefaultTheme()
  })

  it('respects the variant prop', () => {
    expect(render(<StateLabel variant="small" />)).toMatchSnapshot()
    expect(render(<StateLabel variant="large" />)).toMatchSnapshot()
  })

  it('renders children', () => {
    expect(render(<StateLabel>hi</StateLabel>)).toMatchSnapshot()
  })

  it('does not pass on arbitrary attributes', () => {
    const defaultOutput = render(<StateLabel />)
    expect(render(<StateLabel data-foo="bar" />)).toEqual(defaultOutput)
    expect(render(<StateLabel hidden />)).toEqual(defaultOutput)
  })
})
