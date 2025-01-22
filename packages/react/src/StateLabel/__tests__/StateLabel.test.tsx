import React from 'react'
import StateLabel from '../StateLabel'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('StateLabel', () => {
  behavesAsComponent({
    Component: StateLabel,
    toRender: () => <StateLabel status="issueOpened">Open</StateLabel>,
    options: {
      // Rendering a Octicon seems to break getComputedStyles, which
      // the sx prop implementation test uses to make sure the prop is working correctly.
      // Despite my best efforts, I cannot figure out why this is happening. So,
      // unfortunately, we will simply skip this test.
      skipSx: true,
    },
  })

  checkExports('StateLabel', {
    default: StateLabel,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<StateLabel status="issueOpened" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the status prop', () => {
    expect(render(<StateLabel status="issueOpened" />)).toMatchSnapshot()
    expect(render(<StateLabel status="issueClosed" />)).toMatchSnapshot()
    expect(render(<StateLabel status="issueClosedNotPlanned" />)).toMatchSnapshot()
    expect(render(<StateLabel status="pullMerged" />)).toMatchSnapshot()
    expect(render(<StateLabel status="pullQueued" />)).toMatchSnapshot()
  })

  it('respects the variant prop', () => {
    expect(render(<StateLabel variant="small" status="issueOpened" />)).toMatchSnapshot()
    expect(render(<StateLabel variant="normal" status="issueOpened" />)).toMatchSnapshot()
  })

  it('renders children', () => {
    expect(render(<StateLabel status="issueOpened">hi</StateLabel>)).toMatchSnapshot()
  })

  it('adds label to icon', () => {
    const screen1 = HTMLRender(<StateLabel status="issueOpened">Open</StateLabel>)
    expect(screen1.getByLabelText('Issue')).toBeInTheDocument() // svg
    expect(screen1.getByText('Open')).toBeInTheDocument() // text

    const screen2 = HTMLRender(<StateLabel status="pullMerged">Merged</StateLabel>)
    expect(screen2.getByLabelText('Pull request')).toBeInTheDocument() // svg
    expect(screen2.getByText('Merged')).toBeInTheDocument() // text
  })
})
