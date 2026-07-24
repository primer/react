import React from 'react'
import {render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {Overlay} from './Overlay'

describe('Overlay', () => {
  it('forwards its ref and rest props to its surface', () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Overlay ref={ref} data-testid="overlay">
        Contents
      </Overlay>,
    )
    expect(ref.current).toBe(screen.getByTestId('overlay'))
    expect(ref.current).toHaveAttribute('data-component', 'Overlay')
  })
})
