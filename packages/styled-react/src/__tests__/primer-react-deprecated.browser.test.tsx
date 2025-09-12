import {render, screen} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import {Dialog, Octicon, TabNav, Tooltip} from '../deprecated'

describe('@primer/react/deprecated', () => {
  test('Dialog supports `sx` prop', () => {
    render(<Dialog data-testid="component" isOpen sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Octicon supports `sx` prop', () => {
    render(<Octicon data-testid="component" icon={props => <svg {...props} />} sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('TabNav supports `sx` prop', () => {
    render(<TabNav data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('TabNav.Link supports `sx` prop', () => {
    render(<TabNav.Link data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Tooltip supports `sx` prop', () => {
    render(<Tooltip data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })
})
