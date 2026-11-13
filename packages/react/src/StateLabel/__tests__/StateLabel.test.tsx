import {describe, expect, it} from 'vitest'
import StateLabel from '../StateLabel'
import {render as HTMLRender} from '@testing-library/react'
import {page} from 'vitest/browser'
import {implementsClassName} from '../../utils/testing'
import classes from '../StateLabel.module.css'

describe('StateLabel', () => {
  implementsClassName(props => <StateLabel {...props} status="issueOpened" />, classes.StateLabel)

  it('renders data-component attribute', async () => {
    const {container} = HTMLRender(<StateLabel status="issueOpened" />)
    await expect
      .element(container.querySelector<HTMLElement>(':first-child'))
      .toHaveAttribute('data-component', 'StateLabel')
  })

  it('respects the status prop', () => {
    expect(HTMLRender(<StateLabel status="issueOpened" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="issueClosed" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="issueClosedNotPlanned" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="pullMerged" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="pullQueued" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="alertOpened" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="alertFixed" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="alertDismissed" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="alertClosed" />).container).toMatchSnapshot()
    expect(HTMLRender(<StateLabel status="archived" />).container).toMatchSnapshot()
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

  it('adds label to icon', async () => {
    const screen1 = HTMLRender(<StateLabel status="issueOpened">Open</StateLabel>)
    await expect.element(page.getByLabelText('Issue')).toBeInTheDocument() // svg
    await expect.element(page.getByText('Open')).toBeInTheDocument() // text
    screen1.unmount()

    const screen2 = HTMLRender(<StateLabel status="pullMerged">Merged</StateLabel>)
    await expect.element(page.getByLabelText('Pull request')).toBeInTheDocument() // svg
    await expect.element(page.getByText('Merged')).toBeInTheDocument() // text
    screen2.unmount()

    const screen3 = HTMLRender(<StateLabel status="alertFixed">Fixed</StateLabel>)
    await expect.element(page.getByLabelText('Alert')).toBeInTheDocument() // svg
    await expect.element(page.getByText('Fixed')).toBeInTheDocument() // text
    screen3.unmount()

    const screen4 = HTMLRender(<StateLabel status="alertClosed">Closed</StateLabel>)
    await expect.element(page.getByLabelText('Alert')).toBeInTheDocument() // svg
    await expect.element(page.getByText('Closed')).toBeInTheDocument() // text
    screen4.unmount()

    const screenArchived = HTMLRender(<StateLabel status="archived">Archived</StateLabel>)
    await expect.element(page.getByLabelText('Archived')).toBeInTheDocument() // svg
    await expect.element(page.getByText('Archived')).toBeInTheDocument() // text
    screenArchived.unmount()
  })

  it('renders open status without an icon', async () => {
    HTMLRender(<StateLabel status="open">Open</StateLabel>)
    await expect.element(page.getByRole('img')).not.toBeInTheDocument() // svg
    await expect.element(page.getByText('Open')).toBeInTheDocument() // text
  })

  it('renders closed status without an icon', async () => {
    HTMLRender(<StateLabel status="closed">Closed</StateLabel>)
    await expect.element(page.getByRole('img')).not.toBeInTheDocument() // svg
    await expect.element(page.getByText('Closed')).toBeInTheDocument() // text
  })
})
