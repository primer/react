import {render} from '@testing-library/react'
import React from 'react'
import {Table} from '../../DataTable'

describe('Table', () => {
  it('should support changing the cell spacing through `density`', () => {
    const {container, rerender} = render(<Table density="condensed" />)
    expect(container.firstChild).toHaveAttribute('data-density', 'condensed')

    rerender(<Table density="normal" />)
    expect(container.firstChild).toHaveAttribute('data-density', 'normal')

    rerender(<Table density="spacious" />)
    expect(container.firstChild).toHaveAttribute('data-density', 'spacious')
  })
})
