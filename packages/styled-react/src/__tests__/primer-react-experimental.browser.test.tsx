import {render, screen} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import {Dialog, PageHeader, Table, Tooltip} from '../experimental'

describe('@primer/react/experimental', () => {
  test('Dialog supports `sx` prop', () => {
    render(<Dialog data-testid="component" onClose={() => {}} sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByRole('dialog')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('PageHeader supports `sx` prop', () => {
    const {container} = render(<PageHeader data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(container.firstElementChild!).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test('Table.Container', () => {
    render(<Table.Container data-testid="component" sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByTestId('component')).backgroundColor).toBe('rgb(255, 0, 0)')
  })

  test.todo('Tooltip supports `sx` prop', () => {
    render(
      <Tooltip data-testid="component" sx={{background: 'red'}} text="test">
        <button type="button">test</button>
      </Tooltip>,
    )
    expect(window.getComputedStyle(screen.getByRole('tooltip', {hidden: true})).backgroundColor).toBe('rgb(255, 0, 0)')
  })
})
