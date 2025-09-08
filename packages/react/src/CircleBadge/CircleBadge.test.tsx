import CircleBadge from './CircleBadge'
import {CheckIcon} from '@primer/octicons-react'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

const imgInput = <img alt="Example" src="primer.jpg" />

describe('CircleBadge', () => {
  it('respects the inline prop', () => {
    const {container} = HTMLRender(<CircleBadge inline />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('respects the variant prop', () => {
    const {container} = HTMLRender(<CircleBadge variant="large" />)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('uses the size prop to override the variant prop', () => {
    const {container} = HTMLRender(<CircleBadge variant="large" size={20} />)
    expect(container.firstChild).toMatchSnapshot()
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
      expect(container.firstChild).toBeInTheDocument()
    })
  })
})
