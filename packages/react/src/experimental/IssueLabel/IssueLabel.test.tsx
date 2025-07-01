import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {IssueLabel} from '../IssueLabel'

describe('IssueLabel', () => {
  it('should support `className` on outermost element', () => {
    const {container} = render(<IssueLabel className="custom-class">Label</IssueLabel>)
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should support merging `style` on outermost element', () => {
    const {container} = render(<IssueLabel style={{color: 'red', backgroundColor: 'blue'}}>Label</IssueLabel>)
    expect(container.firstChild).toHaveStyle({
      color: 'red',
      backgroundColor: 'blue',
    })
  })
})
