import React from 'react'
import Flash from '..'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Flash', () => {
  behavesAsComponent({Component: Flash})

  checkExports('Flash', {
    default: Flash,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Flash variant="warning" />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "full" prop', () => {
    expect(render(<Flash full />)).toHaveStyleRule('margin-top', '-1px')
    expect(render(<Flash full />)).toHaveStyleRule('border-radius', '0')
    expect(render(<Flash full />)).toHaveStyleRule('border-width', '1px 0px')
  })

  it('respects the "variant" prop', () => {
    expect(render(<Flash variant="warning" />)).toHaveStyleRule(
      'background-color',
      'var(--bgColor-attention-muted,var(--color-attention-subtle,#fff8c5))',
    )
    expect(render(<Flash variant="danger" />)).toHaveStyleRule(
      'background-color',
      'var(--bgColor-danger-muted,var(--color-danger-subtle,#ffebe9))',
    )
    expect(render(<Flash variant="success" />)).toHaveStyleRule(
      'background-color',
      'var(--bgColor-success-muted,var(--color-success-subtle,#dafbe1))',
    )
    expect(render(<Flash />)).toHaveStyleRule(
      'background-color',
      'var(--bgColor-accent-muted,var(--color-accent-subtle,#ddf4ff))',
    )
  })
})
