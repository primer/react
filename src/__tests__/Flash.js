import React from 'react'
import {Flash} from '..'
import {COMMON} from '../constants'
import theme, {colors} from '../theme'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import {Deprecations} from '../utils/deprecate'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Flash', () => {
  behavesAsComponent(Flash, [COMMON])

  checkExports('Flash', {
    default: Flash
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Flash variant="warning" theme={theme} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects the "full" prop', () => {
    expect(render(<Flash full />)).toHaveStyleRule('margin-top', '-1px')
    expect(render(<Flash full />)).toHaveStyleRule('border-radius', '0')
    expect(render(<Flash full />)).toHaveStyleRule('border-width', '1px 0px')
  })

  it('respects the deprecated "scheme" prop', () => {
    expect(render(<Flash scheme="green" theme={theme} />)).toHaveStyleRule('background-color', colors.green[1])
    expect(Deprecations.getDeprecations()).toHaveLength(1)
  })

  it('respects the "variant" prop', () => {
    expect(render(<Flash variant="warning" theme={theme} />)).toHaveStyleRule('background-color', colors.yellow[1])
    expect(render(<Flash variant="danger" theme={theme} />)).toHaveStyleRule('background-color', '#FFE3E6')
    expect(render(<Flash variant="success" theme={theme} />)).toHaveStyleRule('background-color', colors.green[1])
    expect(render(<Flash theme={theme} />)).toHaveStyleRule('background-color', colors.blue[1])
  })
})
