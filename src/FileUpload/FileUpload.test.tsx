import React from 'react'
import FileUpload from '.'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('FileUpload', () => {
  behavesAsComponent({Component: FileUpload})

  checkExports('FileUpload', {
    default: FileUpload,
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FileUpload></FileUpload>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
