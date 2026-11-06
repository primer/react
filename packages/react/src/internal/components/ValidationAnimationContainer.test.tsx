import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, it, expect} from 'vitest'
import ValidationAnimationContainer from './ValidationAnimationContainer'
import {createRenderCounter} from '../../utils/testing/profiler'
import {implementsClassName} from '../../utils/testing'

describe('ValidationAnimationContainer', () => {
  implementsClassName(props => <ValidationAnimationContainer show {...props} />)

  it('renders children when show is true', async () => {
    render(<ValidationAnimationContainer show>content</ValidationAnimationContainer>)
    await expect.element(page.getByText('content', {exact: true})).toBeInTheDocument()
  })

  it('does not render children when show is false initially', async () => {
    render(<ValidationAnimationContainer show={false}>content</ValidationAnimationContainer>)
    await expect.element(page.getByText('content', {exact: true})).not.toBeInTheDocument()
  })

  it('renders children after show transitions to true', async () => {
    const {rerender} = render(<ValidationAnimationContainer show={false}>content</ValidationAnimationContainer>)
    await expect.element(page.getByText('content', {exact: true})).not.toBeInTheDocument()

    rerender(<ValidationAnimationContainer show={true}>content</ValidationAnimationContainer>)
    await expect.element(page.getByText('content', {exact: true})).toBeInTheDocument()
  })

  it('commits once (no cascade) when show transitions to true', () => {
    // The previous implementation set `shouldRender` from an effect, forcing an
    // extra commit after the prop change. Deriving it during render keeps it to one.
    const [Wrap, counter] = createRenderCounter()
    const {rerender} = render(
      <Wrap>
        <ValidationAnimationContainer show={false}>content</ValidationAnimationContainer>
      </Wrap>,
    )
    counter.reset()

    rerender(
      <Wrap>
        <ValidationAnimationContainer show={true}>content</ValidationAnimationContainer>
      </Wrap>,
    )

    expect(counter.updateCount).toBe(1)
    expect(counter.nestedUpdateCount).toBe(0)
  })
})
