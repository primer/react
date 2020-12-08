import React from 'react'
import {LabelGroup, Label} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {COMMON} from '../constants'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

const comp = (
  <LabelGroup>
    <Label>Default label</Label>
    <Label>Darker gray label</Label>
    <Label outline>Default outline label</Label>
  </LabelGroup>
)

describe('LabelGroup', () => {
  behavesAsComponent(LabelGroup, [COMMON])

  checkExports('LabelGroup', {
    default: LabelGroup,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(comp)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
