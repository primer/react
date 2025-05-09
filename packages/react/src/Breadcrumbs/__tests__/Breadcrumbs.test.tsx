import React from 'react'
import Breadcrumbs from '..'
import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('Breadcrumbs', () => {
  it('should support `className` on the outermost element', () => {
    const {container} = render(<Breadcrumbs className="test-class-name" />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <nav>', () => {
    const {container} = render(<Breadcrumbs />)
    expect(container.firstChild?.nodeName).toEqual('NAV')
  })
})
