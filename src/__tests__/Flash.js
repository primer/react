import React from 'react'
import Flash from '../Flash'
import {COMMON} from '../constants'
import theme, {colors} from '../theme'
import {render} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Flash', () => {
  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Flash scheme="yellow" theme={theme} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('implements system props', () => {
    expect(Flash).toImplementSystemProps(COMMON)
  })

  it('has default theme', () => {
    expect(Flash).toSetDefaultTheme()
  })

  it('respects the "full" prop', () => {
    expect(render(<Flash full />)).toHaveStyleRule('margin-top', '-1px')
    expect(render(<Flash full />)).toHaveStyleRule('border-radius', '0')
    expect(render(<Flash full />)).toHaveStyleRule('border-width', '1px 0px')
  })

  it('respects the "as" prop', () => {
    expect(render(<Flash as="span" />).type).toEqual('span')
  })

  it('respects the "scheme" prop', () => {
    expect(render(<Flash scheme="yellow" theme={theme} />)).toHaveStyleRule('color', colors.yellow[9])
    expect(render(<Flash scheme="red" theme={theme} />)).toHaveStyleRule('color', colors.red[9])
    expect(render(<Flash scheme="green" theme={theme} />)).toHaveStyleRule('color', colors.green[8])
  })
})
