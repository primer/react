import React from 'react'
import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {ToggleSwitch} from './ToggleSwitch'

describe('ToggleSwitch', () => {
  it.each([
    {disabled: true, loading: false},
    {disabled: false, loading: true},
    {disabled: true, loading: true},
  ])('preserves disabled semantics and keyboard discovery for $disabled disabled / $loading loading', async state => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    const ref = React.createRef<HTMLElement>()
    const inputRef = React.createRef<HTMLInputElement>()
    const {rerender} = render(
      <>
        <button type="button">Before</button>
        <ToggleSwitch
          {...state}
          ref={ref}
          inputRef={inputRef}
          aria-label="Firewall"
          aria-describedby="reason"
          checked={false}
          onCheckedChange={onCheckedChange}
        />
        <p id="reason">Managed by your organization</p>
        <button type="button">After</button>
      </>,
    )
    const control = screen.getByRole('switch', {name: 'Firewall'})
    expect(control).toHaveAttribute('aria-disabled', 'true')
    expect(control).toHaveAttribute('tabindex', '0')
    expect(control).toHaveAccessibleDescription('Managed by your organization')
    expect(inputRef.current?.disabled).toBe(state.disabled)
    expect(ref.current).toBe(control)
    screen.getByRole('button', {name: 'Before'}).focus()
    await user.tab()
    expect(control).toHaveFocus()
    await user.keyboard(' {Enter}')
    await user.tab()
    expect(screen.getByRole('button', {name: 'After'})).toHaveFocus()
    await user.click(control)
    await user.click(screen.getByText('Off'))
    expect(control).not.toBeChecked()
    expect(onCheckedChange).not.toHaveBeenCalled()
    rerender(
      <ToggleSwitch {...state} aria-label="Firewall" checked onCheckedChange={onCheckedChange} inputRef={inputRef} />,
    )
    expect(screen.getByRole('switch', {name: 'Firewall'})).toBeChecked()
    expect(screen.getByRole('switch', {name: 'Firewall'})).toHaveAttribute('aria-disabled', 'true')
    rerender(<ToggleSwitch aria-label="Firewall" checked onCheckedChange={onCheckedChange} />)
    const available = screen.getByRole('switch', {name: 'Firewall'})
    expect(available).not.toHaveAttribute('aria-disabled')
    available.focus()
    await user.keyboard(' ')
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything())
  })

  it('preserves a consumer tabIndex on a disabled switch', () => {
    render(<ToggleSwitch aria-label="Firewall" disabled tabIndex={-1} />)
    const control = screen.getByRole('switch', {name: 'Firewall'})
    expect(control).toHaveAttribute('aria-disabled', 'true')
    expect(control).toHaveAttribute('tabindex', '-1')
  })

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
    await user.keyboard('{Enter}')
    expect(control).not.toBeChecked()
    await user.keyboard(' ')
    expect(control).toBeChecked()
    expect(ref.current).toBe(screen.getByTestId('switch'))
    expect(new FormData(control.closest('form')!).get('enabled')).toBe('yes')
  })

  it('keeps a read-only switch focusable without allowing activation', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<ToggleSwitch aria-label="Notifications" readOnly onCheckedChange={onCheckedChange} />)

    const control = screen.getByRole('switch', {name: 'Notifications'})
    expect(control).toHaveAttribute('aria-readonly', 'true')
    expect(control).not.toHaveAttribute('aria-disabled')
    await user.tab()
    expect(control).toHaveFocus()
    await user.keyboard(' {Enter}')
    await user.click(screen.getByText('Off'))
    expect(control).not.toBeChecked()
    expect(onCheckedChange).not.toHaveBeenCalled()
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

  it('exposes switch semantics and lets its hidden input notify an enclosing form', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    const onFormChange = vi.fn()
    render(
      <form onChange={onFormChange}>
        <ToggleSwitch aria-label="Notifications" name="notifications" onCheckedChange={onCheckedChange} />
      </form>,
    )

    const control = screen.getByRole('switch', {name: 'Notifications'})
    expect(control).toHaveAttribute('aria-checked', 'false')
    await user.click(control)
    expect(control).toHaveAttribute('aria-checked', 'true')
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.objectContaining({event: expect.any(Event)}))
    expect(onFormChange).toHaveBeenCalledOnce()
    expect(onFormChange.mock.calls[0][0].target).toMatchObject({name: 'notifications', type: 'checkbox'})
  })

  it('places the status label after the switch with statusLabelPosition="end"', () => {
    render(<ToggleSwitch aria-label="Label end" statusLabelPosition="end" />)

    const container = screen
      .getByRole('switch', {name: 'Label end'})
      .closest('[data-component="ToggleSwitch.Container"]')
    expect(container).toHaveAttribute('data-status-label-position', 'end')
    expect(container).toHaveClass('primer:flex-row-reverse')
  })

  it('blocks input while loading and describes the switch with the loading label after the delay', async () => {
    vi.useFakeTimers()
    try {
      const fixture = (loading: boolean) => (
        <>
          <p id="reason">Managed by your organization</p>
          <ToggleSwitch
            aria-label="Feature"
            aria-describedby="reason"
            loading={loading}
            loadingLabel="Enabling feature"
            loadingLabelDelay={1000}
          />
        </>
      )
      const {rerender} = render(fixture(true))

      const control = screen.getByRole('switch', {name: 'Feature'})
      const status = screen.getByRole('status')
      expect(control).toHaveAttribute('data-loading')
      expect(control).toHaveAttribute('aria-disabled', 'true')
      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(status).toBeEmptyDOMElement()
      expect(control).toHaveAccessibleDescription('Managed by your organization')

      act(() => control.click())
      expect(control).not.toBeChecked()

      act(() => vi.advanceTimersByTime(999))
      expect(status).toBeEmptyDOMElement()
      rerender(fixture(false))
      act(() => vi.advanceTimersByTime(1))
      expect(status).toBeEmptyDOMElement()
      expect(control).toHaveAccessibleDescription('Managed by your organization')

      rerender(fixture(true))
      act(() => vi.advanceTimersByTime(1000))
      expect(status).toHaveTextContent('Enabling feature')
      expect(control).toHaveAccessibleDescription('Enabling feature Managed by your organization')

      rerender(fixture(false))
      expect(status).toBeEmptyDOMElement()
      expect(control).not.toHaveAttribute('aria-disabled')
      expect(control).toHaveAccessibleDescription('Managed by your organization')
    } finally {
      vi.useRealTimers()
    }
  })
})
