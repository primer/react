import {CircleBadge} from '..'
import {CheckIcon} from '@primer/octicons-react'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from '@jest/globals'

const imgInput = <img alt="Example" src="primer.jpg" />

describe('CircleBadge', () => {
  it('respects the inline prop', () => {
    const {container} = HTMLRender(<CircleBadge inline />)
    const badge = container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(badge)
    expect(computedStyle.display).toBe('inline-flex')
  })

  it('respects the variant prop', () => {
    const {container} = HTMLRender(<CircleBadge variant="large" />)
    const badge = container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(badge)
    expect(computedStyle.width).toBe('128px') // large variant should be 128px
    expect(computedStyle.height).toBe('128px')
  })

  it('uses the size prop to override the variant prop', () => {
    const {container} = HTMLRender(<CircleBadge variant="large" size={20} />)
    const badge = container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(badge)
    expect(computedStyle.width).toBe('20px') // size prop should override variant
    expect(computedStyle.height).toBe('20px')
  })

  it('applies title', () => {
    const {container} = HTMLRender(
      <CircleBadge as="a" title="primer logo">
        {imgInput}
      </CircleBadge>,
    )
    expect(container.firstChild).toHaveAttribute('title', 'primer logo')
  })

  it('preserves child class names', () => {
    const {getByRole} = HTMLRender(
      <CircleBadge>
        <img className="primer" alt="Example" src="primer.jpg" />
      </CircleBadge>,
    )
    expect(getByRole('img')).toHaveClass('primer')
  })

  describe('CircleBadge.Icon', () => {
    it('renders an icon', () => {
      const {container} = HTMLRender(<CircleBadge.Icon icon={CheckIcon} />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(svg).toHaveClass('octicon-check')
    })
  })
})
