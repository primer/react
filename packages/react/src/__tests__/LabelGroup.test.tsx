import React from 'react'
import {render as HTMLRender, waitFor} from '@testing-library/react'
import axe from 'axe-core'
import {LabelGroup, Label, ThemeProvider, BaseStyles} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import theme from '../theme'
import userEvent from '@testing-library/user-event'

const ThemeAndStyleContainer: React.FC<React.PropsWithChildren> = ({children}) => (
  <ThemeProvider theme={theme}>
    <BaseStyles>{children}</BaseStyles>
  </ThemeProvider>
)

const AutoTruncateContainer: React.FC<React.PropsWithChildren & {width?: number}> = ({children, width}) => (
  <div style={{width}}>{children}</div>
)

const observe = jest.fn()

describe('LabelGroup', () => {
  window.IntersectionObserver = jest.fn(() => ({
    observe,
    unobserve: jest.fn(),
    takeRecords: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  })) as jest.Mock<IntersectionObserver>

  behavesAsComponent({Component: LabelGroup, options: {skipAs: true}})

  checkExports('LabelGroup', {
    default: LabelGroup,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <ThemeAndStyleContainer>
        <LabelGroup>
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
          <Label>Six</Label>
          <Label>Seven</Label>
          <Label>Eight</Label>
          <Label>Nine</Label>
          <Label>Ten</Label>
          <Label>Eleven</Label>
          <Label>Twelve</Label>
          <Label>Thirteen</Label>
          <Label>Fourteen</Label>
          <Label>Fifteen</Label>
          <Label>Sixteen</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('observers intersections on each child', async () => {
    HTMLRender(
      <ThemeAndStyleContainer>
        <AutoTruncateContainer width={600}>
          <LabelGroup visibleChildCount="auto">
            <Label>One</Label>
            <Label>Two</Label>
            <Label>Three</Label>
            <Label>Four</Label>
            <Label>Five</Label>
            <Label>Six</Label>
            <Label>Seven</Label>
            <Label>Eight</Label>
            <Label>Nine</Label>
            <Label>Ten</Label>
            <Label>Eleven</Label>
            <Label>Twelve</Label>
            <Label>Thirteen</Label>
            <Label>Fourteen</Label>
            <Label>Fifteen</Label>
            <Label>Sixteen</Label>
          </LabelGroup>
        </AutoTruncateContainer>
      </ThemeAndStyleContainer>,
    )

    expect(observe).toHaveBeenCalledTimes(16)
  })

  it('should truncate labels to a specified number', () => {
    const {getByText} = HTMLRender(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3}>
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const expandButton = getByText('+2')

    expect(expandButton).toBeDefined()
  })

  it('should expand all tokens into an overlay when overflowStyle="overlay"', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByText} = HTMLRender(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3} overflowStyle="overlay">
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const expandButton = getByText('+2')
    await user.click(expandButton)
    await waitFor(() => getByLabelText('Close'))

    expect(document.activeElement).toBe(getByLabelText('Close'))
  })

  it('should expand all tokens in place when overflowStyle="inline"', async () => {
    const user = userEvent.setup()
    const {getByText} = HTMLRender(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3} overflowStyle="inline">
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )
    const expandButton = getByText('+2')
    const fourthLabel = getByText('Four')

    expect(fourthLabel).not.toBeVisible()

    await user.click(expandButton)

    expect(fourthLabel).toBeVisible()
  })

  it('should focus the collapse button when expanded, and the expand button when collapsed', async () => {
    const user = userEvent.setup()
    const {getByText} = HTMLRender(
      <ThemeAndStyleContainer>
        <LabelGroup visibleChildCount={3} overflowStyle="inline">
          <Label>One</Label>
          <Label>Two</Label>
          <Label>Three</Label>
          <Label>Four</Label>
          <Label>Five</Label>
        </LabelGroup>
      </ThemeAndStyleContainer>,
    )

    // Expand
    await user.click(getByText('+2'))
    await waitFor(() => getByText('Show less'))

    expect(document.activeElement).toEqual(getByText('Show less').closest('button'))

    // Collapse
    await user.click(getByText('Show less'))
    await waitFor(() => getByText('+2'))

    expect(document.activeElement).toEqual(getByText('+2').closest('button'))
  })
})
