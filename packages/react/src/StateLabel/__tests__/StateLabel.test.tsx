import {describe, expect, it} from 'vitest'
import StateLabel from '../StateLabel'
import {render as HTMLRender} from '@testing-library/react'
import {implementsClassName} from '../../utils/testing'
import classes from '../StateLabel.module.css'

describe('StateLabel', () => {
  implementsClassName(props => <StateLabel {...props} status="issueOpened" />, classes.StateLabel)

  it('respects the status prop', () => {
    expect(HTMLRender(<StateLabel status="issueOpened" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="issueClosed" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="issueClosedNotPlanned" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="pullMerged" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="pullQueued" />).container).toMatchSnapshot()
  })

  it('respects the deprecated variant prop', () => {
    expect(HTMLRender(<StateLabel variant="small" status="issueOpened" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel variant="normal" status="issueOpened" />).container).toMatchSnapshot()
  })

  it('respects the size prop', () => {
    expect(HTMLRender(<StateLabel size="small" status="issueOpened" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel size="medium" status="issueOpened" />).container).toMatchSnapshot()
  })

  it('prefers the size prop over deprecated variant prop', () => {
    expect(HTMLRender(<StateLabel size="small" variant="normal" status="issueOpened" />).container).toMatchSnapshot()
  })

  it('renders children', () => {
    expect(HTMLRender(<StateLabel status="issueOpened">hi</StateLabel>).container).toMatchSnapshot()
  })

  it('adds label to icon', () => {
    const screen1 = HTMLRender(<StateLabel status="issueOpened">Open</StateLabel>)
    expect(screen1.getByLabelText('Issue')).toBeInTheDocument() // svg
    expect(screen1.getByText('Open')).toBeInTheDocument() // text

    const screen2 = HTMLRender(<StateLabel status="pullMerged">Merged</StateLabel>)
    expect(screen2.getByLabelText('Pull request')).toBeInTheDocument() // svg
    expect(screen2.getByText('Merged')).toBeInTheDocument() // text
  })
  it('renders open status without an icon', () => {
    const screen = HTMLRender(<StateLabel status="open">Open</StateLabel>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument() // svg
    expect(screen.getByText('Open')).toBeInTheDocument() // text
  })
  it('renders closed status without an icon', () => {
    const screen = HTMLRender(<StateLabel status="closed">Closed</StateLabel>)
    expect(screen.queryByRole('img')).not.toBeInTheDocument() // svg
    expect(screen.getByText('Closed')).toBeInTheDocument() // text
  })
})
