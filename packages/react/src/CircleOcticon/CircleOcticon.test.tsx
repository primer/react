import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import {CircleOcticon} from '..'
import {render as HTMLRender} from '@testing-library/react'
import {describe, expect, it} from 'vitest'

describe('CircleOcticon', () => {
  it('renders a <div> with the correct size', () => {
    const {container} = HTMLRender(<CircleOcticon icon={CheckIcon} size={10} />)
    const element = container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(element)
    expect(computedStyle.getPropertyValue('width')).toBe('10px')
    expect(computedStyle.getPropertyValue('height')).toBe('10px')
  })

  it('renders with border-radius: 50%', () => {
    const {container} = HTMLRender(<CircleOcticon icon={CheckIcon} />)
    const element = container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(element)
    expect(computedStyle.getPropertyValue('border-radius')).toBe('50%')
  })

  it('has a default size of 32px', () => {
    const {container} = HTMLRender(<CircleOcticon icon={CheckIcon} />)
    const element = container.firstChild as HTMLElement
    const computedStyle = window.getComputedStyle(element)
    expect(computedStyle.getPropertyValue('width')).toBe('32px')
    expect(computedStyle.getPropertyValue('height')).toBe('32px')
  })
})
