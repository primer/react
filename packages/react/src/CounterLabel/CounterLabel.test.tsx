import {describe, expect, it} from 'vitest'
import {CounterLabel} from '..'
import {render as HTMLRender} from '@testing-library/react'
import classes from './CounterLabel.module.css'
import {implementsClassName} from '../utils/testing'

describe('CounterLabel', () => {
  implementsClassName(CounterLabel, classes.CounterLabel)

  it('renders a <span>', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild?.nodeName).toEqual('SPAN')
  })

  it('renders the counter correctly', () => {
    const {container} = HTMLRender(<CounterLabel>12K</CounterLabel>)
    expect(container.firstChild).toHaveTextContent('12K')
  })

  it('renders the visually visible span with "aria-hidden=true"', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('respects the primary "variant" prop', () => {
    const {container} = HTMLRender(<CounterLabel variant="primary">1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-variant', 'primary')
  })

  it('respects the secondary "variant" prop', () => {
    const {container} = HTMLRender(<CounterLabel variant="secondary">1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-variant', 'secondary')
  })

  it('respects the primary "scheme" prop', () => {
    const {container} = HTMLRender(<CounterLabel scheme="primary">1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-variant', 'primary')
  })

  it('renders with secondary variant when no "scheme" or "variant" prop is provided', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-variant', 'secondary')
  })

  it('prefer variant over "scheme" prop', () => {
    const {container} = HTMLRender(
      <CounterLabel scheme="secondary" variant="primary">
        1234
      </CounterLabel>,
    )
    expect(container.firstChild).toBeInTheDocument()
    expect(container.firstChild).toHaveAttribute('data-variant', 'primary')
  })

  it('should render visually hidden span correctly for screen readers', () => {
    const {container} = HTMLRender(<CounterLabel>1234</CounterLabel>)
    // Second span renders as visually hidden for screen readers and the content is &nbsp;(counter).
    // Non-breaking space is used because browsers tend to strip a standard space.
    expect(container.children[1].textContent).toEqual('\u00a0(1234)')
  })
})
