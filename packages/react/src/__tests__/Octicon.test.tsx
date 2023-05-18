import React from 'react'
import {XIcon} from '@primer/octicons-react'
import {Octicon} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Octicon', () => {
  behavesAsComponent({
    Component: Octicon,
    toRender: () => <Octicon icon={XIcon} />,
  })

  checkExports('Octicon', {
    default: Octicon,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Octicon icon={XIcon} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
