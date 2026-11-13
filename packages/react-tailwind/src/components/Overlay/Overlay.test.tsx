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
    expect(ref.current).toHaveClass('primer:bg-[var(--overlay-bgColor)]')
  })

  it('exposes its root and content through the primary namespace', () => {
    expect(Overlay.Root).toBe(Overlay)
    render(<Overlay.Content data-testid="content">Contents</Overlay.Content>)
    expect(screen.getByTestId('content')).toHaveAttribute('data-component', 'Overlay.Content')
  })
})
