import React from 'react'
import FormControl from '../FormControl'
import {render} from '@testing-library/react'

describe('FormControl.Validation', () => {
  it('should provide support for `className` on the outermost element', () => {
    const {container} = render(
      <FormControl.Validation className="custom-class" variant="success">
        Validation message
      </FormControl.Validation>,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
