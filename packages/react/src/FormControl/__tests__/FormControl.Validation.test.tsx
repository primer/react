import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import FormControl from '../FormControl'

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
