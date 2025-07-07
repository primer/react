import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {SelectPanel} from '../'

describe('SelectPanel.Loading', () => {
  it('renders correctly', () => {
    const {container} = render(<SelectPanel.Loading>test</SelectPanel.Loading>)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders with default message when no children are provided', () => {
    const {container} = render(<SelectPanel.Loading />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
