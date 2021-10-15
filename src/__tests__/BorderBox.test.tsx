import React from 'react'
import theme from '../theme'
import {BorderBox} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('BorderBox', () => {
  behavesAsComponent({Component: BorderBox})

  checkExports('BorderBox', {
    default: BorderBox
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<BorderBox />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders borders', () => {
    expect(render(<BorderBox borderColor="success.emphasis" />)).toHaveStyleRule(
      'border-color',
      theme.colorSchemes.light.colors.success?.emphasis
    )
    expect(render(<BorderBox borderBottom={0} />)).toHaveStyleRule('border-bottom', '0')
  })

  it('renders border radius', () => {
    expect(render(<BorderBox borderRadius={2} />)).toHaveStyleRule('border-radius', theme.radii[2])
  })

  // the test returns the box shadow value without spaces, so had to manually provide the expected string here
  it('renders box shadow', () => {
    expect(render(<BorderBox boxShadow="shadow.small" />)).toHaveStyleRule(
      'box-shadow',
      theme.colorSchemes.light.shadows.shadow?.small
    )
  })
})
