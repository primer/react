import React from 'react'
import {Label} from '..'
import {render, behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('Label', () => {
  behavesAsComponent(Label, [COMMON])

  checkExports('Label', {
    default: Label,
  })

  it('renders a <span>', () => {
    expect(render(<Label />).type).toEqual('span')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Label>hello</Label>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('respects the "outline" prop', () => {
    expect(render(<Label outline />)).toMatchSnapshot()
  })

  it('respects the "variant" prop', () => {
    expect(render(<Label variant="xl" />)).toMatchSnapshot()
  })
})
