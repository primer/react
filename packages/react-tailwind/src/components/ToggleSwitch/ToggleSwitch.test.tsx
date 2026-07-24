import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it} from 'vitest'
import {ToggleSwitch} from './ToggleSwitch'

describe('ToggleSwitch', () => {
  it('toggles with the keyboard, participates in forms, and forwards ref and props', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    render(
      <form>
        <ToggleSwitch ref={ref} name="enabled" value="yes" aria-label="Enable" data-testid="switch" />
      </form>,
    )
    const control = screen.getByRole('switch')
    control.focus()
    await user.keyboard(' ')
    expect(control).toBeChecked()
    expect(ref.current).toBe(screen.getByTestId('switch'))
    expect(new FormData(control.closest('form')!).get('enabled')).toBe('yes')
  })
})
