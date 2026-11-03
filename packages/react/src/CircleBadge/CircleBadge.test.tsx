import {page} from 'vitest/browser'
import CircleBadge from './CircleBadge'
import {CheckIcon} from '@primer/octicons-react'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {implementsClassName} from '../utils/testing'
import classes from './CircleBadge.module.css'

const imgInput = <img alt="Example" src="primer.jpg" />

describe('CircleBadge', () => {
  implementsClassName(CircleBadge, classes.CircleBadge)

  it('renders data-component attribute', async () => {
    const {container} = HTMLRender(<CircleBadge />)
    await expect.element(container.querySelector('[data-component="CircleBadge"]')).toBeInTheDocument()
  })

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

  it('applies title', async () => {
    HTMLRender(
      <CircleBadge as="a" title="primer logo">
        {imgInput}
      </CircleBadge>,
    )
    await expect.element(page.getByTitle('primer logo')).toHaveAttribute('title', 'primer logo')
  })

  it('preserves child class names', async () => {
    HTMLRender(
      <CircleBadge>
        <img className="primer" alt="Example" src="primer.jpg" />
      </CircleBadge>,
    )
    await expect.element(page.getByRole('img')).toHaveClass('primer')
  })

  describe('CircleBadge.Icon', () => {
    it('renders an icon', async () => {
      const {container} = HTMLRender(<CircleBadge.Icon icon={CheckIcon} />)
      await expect.element(container.firstChild).toBeInTheDocument()
    })

    it('renders data-component attribute', async () => {
      const {container} = HTMLRender(<CircleBadge.Icon icon={CheckIcon} />)
      await expect.element(container.querySelector('[data-component="CircleBadge.Icon"]')).toBeInTheDocument()
    })
  })
})
