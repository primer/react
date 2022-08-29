import React from 'react'
import Label from '../../deprecated/Label'
import {render, behavesAsComponent, checkExports} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Label', () => {
  behavesAsComponent({Component: Label})

  checkExports('deprecated/Label', {
    default: Label
  })

  it('renders a <span>', () => {
    expect(render(<Label />).type).toEqual('span')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Label>hello</Label>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('respects the "outline" prop', () => {
    expect(render(<Label outline />)).toMatchSnapshot()
  })

  it('respects the "variant" prop', () => {
    expect(render(<Label variant="xl" />)).toMatchSnapshot()
  })
})
