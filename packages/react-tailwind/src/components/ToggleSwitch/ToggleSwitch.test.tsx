import React from 'react'
import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
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

  it('renders custom status labels that toggle the switch when clicked', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <ToggleSwitch aria-label="Images" buttonLabelOff="Hide" buttonLabelOn="Show" onCheckedChange={onCheckedChange} />,
    )

    const control = screen.getByRole('switch', {name: 'Images'})
    const statusLabel = control.parentElement!.querySelector('[data-component="ToggleSwitch.StatusLabel"]')!
    expect(statusLabel).toHaveAttribute('aria-hidden', 'true')
    expect(statusLabel).toHaveTextContent('ShowHide')

    await user.click(screen.getByText('Hide'))
    expect(control).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
  })

  it('places the status label after the switch with statusLabelPosition="end"', () => {
    render(<ToggleSwitch aria-label="Label end" statusLabelPosition="end" />)

    const container = screen
      .getByRole('switch', {name: 'Label end'})
      .closest('[data-component="ToggleSwitch.Container"]')
    expect(container).toHaveAttribute('data-status-label-position', 'end')
    expect(container).toHaveClass('flex-row-reverse')
  })

  it('blocks input while loading and describes the switch with the loading label after the delay', async () => {
    vi.useFakeTimers()
    try {
      render(<ToggleSwitch aria-label="Feature" loading loadingLabel="Enabling feature" loadingLabelDelay={1000} />)

      const control = screen.getByRole('switch', {name: 'Feature'})
      expect(control).toHaveAttribute('data-loading')
      expect(control).toHaveAttribute('aria-disabled', 'true')
      expect(control).not.toHaveAccessibleDescription()

      act(() => control.click())
      expect(control).not.toBeChecked()

      act(() => vi.advanceTimersByTime(1000))
      expect(control).toHaveAccessibleDescription('Enabling feature')
    } finally {
      vi.useRealTimers()
    }
  })
})
