import React from 'react'
import {FormGroup, TextInput} from '..'
import {COMMON, TYPOGRAPHY} from '../constants'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('FormGroup', () => {
  behavesAsComponent(FormGroup, [COMMON])

  checkExports('FormGroup', {
    default: FormGroup
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(
      <FormGroup>
        <FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>
        <TextInput id="example-text" value="Example Value" />
      </FormGroup>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})

describe('FormGroup.Label', () => {
  behavesAsComponent(FormGroup.Label, [COMMON, TYPOGRAPHY])

  checkExports('FormGroup', {
    default: FormGroup
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FormGroup.Label htmlFor="example-text">Example text</FormGroup.Label>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })
})
