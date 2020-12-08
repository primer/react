import React from 'react'
import {CircleBadge} from '..'
import {CheckIcon} from '@primer/octicons-react'
import {render, mount, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const imgInput = <img alt="" src="primer.jpg" />

describe('CircleBadge', () => {
  behavesAsComponent(CircleBadge, [COMMON], () => <CircleBadge>{imgInput}</CircleBadge>)

  checkExports('CircleBadge', {
    default: CircleBadge,
  })

  describe('CircleBadge.Icon', () => {
    behavesAsComponent(CircleBadge.Icon, [COMMON], () => (
      <CircleBadge.Icon icon={CheckIcon}>
        <div />
      </CircleBadge.Icon>
    ))
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<CircleBadge variant="large" size={20} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects the inline prop', () => {
    expect(render(<CircleBadge inline />)).toMatchSnapshot()
  })

  it('respects the variant prop', () => {
    expect(render(<CircleBadge variant="large" />)).toMatchSnapshot()
  })

  it('uses the size prop to override the variant prop', () => {
    expect(render(<CircleBadge variant="large" size={20} />)).toMatchSnapshot()
  })

  it('applies title', () => {
    expect(
      render(
        <CircleBadge as="a" title="primer logo">
          {imgInput}
        </CircleBadge>
      ).props['title']
    ).toEqual('primer logo')
  })

  it('preserves child class names', () => {
    const comp = mount(
      <CircleBadge>
        <img className="primer" alt="" src="primer.jpg" />
      </CircleBadge>
    )
    expect(comp.find('img').hasClass('primer')).toEqual(true)
  })
})
