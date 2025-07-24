import {describe, expect, it} from '@jest/globals'
import StateLabel from '../StateLabel'
import {render as HTMLRender} from '@testing-library/react'

describe('StateLabel', () => {
  it('respects the status prop', () => {
    // Test issueOpened status
    const issueOpened = HTMLRender(<StateLabel status="issueOpened" />)
    expect(issueOpened.getByLabelText('Issue')).toBeInTheDocument()
    issueOpened.unmount()

    // Test issueClosed status
    const issueClosed = HTMLRender(<StateLabel status="issueClosed" />)
    expect(issueClosed.getByLabelText('Issue')).toBeInTheDocument()
    issueClosed.unmount()

    // Test issueClosedNotPlanned status
    const issueClosedNotPlanned = HTMLRender(<StateLabel status="issueClosedNotPlanned" />)
    expect(issueClosedNotPlanned.getByLabelText('Issue, not planned')).toBeInTheDocument()
    issueClosedNotPlanned.unmount()

    // Test pullMerged status
    const pullMerged = HTMLRender(<StateLabel status="pullMerged" />)
    expect(pullMerged.getByLabelText('Pull request')).toBeInTheDocument()
    pullMerged.unmount()

    // Test pullQueued status
    const pullQueued = HTMLRender(<StateLabel status="pullQueued" />)
    expect(pullQueued.getByLabelText('Pull request')).toBeInTheDocument()
    pullQueued.unmount()
  })

  it('respects the variant prop', () => {
    const smallVariant = HTMLRender(<StateLabel variant="small" status="issueOpened" />)
    const smallLabel = smallVariant.container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(smallLabel)
    expect(computedStyle.fontSize).toBe('12px') // small variant has fontSize: 0 which maps to 12px

    const normalVariant = HTMLRender(<StateLabel variant="normal" status="issueOpened" />)
    const normalLabel = normalVariant.container.firstChild as HTMLElement
    const normalComputedStyle = window.getComputedStyle(normalLabel)
    expect(normalComputedStyle.fontSize).toBe('14px') // normal variant has fontSize: 1 which maps to 14px
  })

  it('renders children', () => {
    const {getByText, getByLabelText} = HTMLRender(<StateLabel status="issueOpened">hi</StateLabel>)
    expect(getByText('hi')).toBeInTheDocument()
    expect(getByLabelText('Issue')).toBeInTheDocument() // Icon should still be present
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
