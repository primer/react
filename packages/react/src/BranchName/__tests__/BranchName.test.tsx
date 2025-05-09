import React from 'react'
import BranchName from '../BranchName'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('BranchName', () => {
  it('renders an <a> by default', () => {
    const {container} = render(<BranchName />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('should support `className` on the outermost element', () => {
    const {container} = render(<BranchName className="test-class-name" />)
    expect(container.firstChild).toHaveClass('test-class-name')
  })
})
