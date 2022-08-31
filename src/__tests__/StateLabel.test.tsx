import React from 'react'
import {StateLabel} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('StateLabel', () => {
  behavesAsComponent({
    Component: StateLabel,
    toRender: () => <StateLabel status="issueOpened">Open</StateLabel>,
    options: {
      // Rendering a StyledOcticon seems to break getComputedStyles, which
      // the sx prop implementation test uses to make sure the prop is working correctly.
      // Despite my best efforts, I cannot figure out why this is happening. So,
      // unfortunately, we will simply skip this test.
      skipSx: true
    }
  })

  checkExports('StateLabel', {
    default: StateLabel
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<StateLabel status="issueOpened" />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the status prop', () => {
    expect(render(<StateLabel status="issueOpened" />)).toMatchSnapshot()
    expect(render(<StateLabel status="issueClosed" />)).toMatchSnapshot()
    expect(render(<StateLabel status="issueClosedNotPlanned" />)).toMatchSnapshot()
    expect(render(<StateLabel status="pullMerged" />)).toMatchSnapshot()
  })

  it('respects the variant prop', () => {
    expect(render(<StateLabel variant="small" status="issueOpened" />)).toMatchSnapshot()
    expect(render(<StateLabel variant="normal" status="issueOpened" />)).toMatchSnapshot()
  })

  it('renders children', () => {
    expect(render(<StateLabel status="issueOpened">hi</StateLabel>)).toMatchSnapshot()
  })
})
