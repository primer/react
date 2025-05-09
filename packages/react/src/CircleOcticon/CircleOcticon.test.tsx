import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import {CircleOcticon} from '..'
import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('CircleOcticon', () => {
  it('renders a div element', () => {
    const {container} = render(<CircleOcticon icon={CheckIcon} size={10} />)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('renders with custom size', () => {
    const {container} = render(<CircleOcticon icon={CheckIcon} size={10} />)
    expect(container.firstChild).toBeDefined()
  })

  it('renders with default size', () => {
    const {container} = render(<CircleOcticon icon={CheckIcon} />)
    expect(container.firstChild).toBeDefined()
  })

  it('renders with background color', () => {
    const {container} = render(<CircleOcticon icon={CheckIcon} bg="danger.subtle" />)
    expect(container.firstChild).toBeDefined()
  })
})
