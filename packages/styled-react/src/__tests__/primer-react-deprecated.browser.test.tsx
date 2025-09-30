import {render, screen} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import {Dialog, Octicon, TabNav, Tooltip} from '../deprecated'
import {Button} from '../index'

describe('@primer/react/deprecated', () => {
  test('Dialog supports `sx` prop', () => {
    render(<Dialog as="button" data-testid="component" isOpen sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component').role).toBe('dialog')
  })

  test('Dialog.Header supports `sx` prop', () => {
    render(<Dialog.Header as="button" data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByTestId('component').className.includes('Header')).toBe(true)
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
    render(<TabNav.Link data-testid="component" sx={{background: 'red'}} as={Button} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(window.getComputedStyle(screen.getByRole('tab')).backgroundColor).toBe('rgb(255, 0, 0)')
    expect(screen.getByRole('tab').tagName).toBe('BUTTON')
  })

  test('Tooltip supports `sx` prop', () => {
    render(<Tooltip data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })
})
