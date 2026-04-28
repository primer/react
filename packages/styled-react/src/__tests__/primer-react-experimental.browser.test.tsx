import {render, screen} from '@testing-library/react'
import {describe, expect, test} from 'vitest'
import {Dialog} from '../experimental'

describe('@primer/react/experimental', () => {
  test('Dialog supports `sx` prop', () => {
    render(<Dialog data-testid="component" onClose={() => {}} sx={{background: 'red'}} />)
    expect(window.getComputedStyle(screen.getByRole('dialog')).backgroundColor).toBe('rgb(255, 0, 0)')
  })
})
