import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {render, waitFor} from '@testing-library/react'
import ToggleSwitch from './'
import userEvent from '@testing-library/user-event'
import {implementsClassName} from '../utils/testing'
import classes from './ToggleSwitch.module.css'
import {page, userEvent as browserUserEvent} from 'vitest/browser'

const SWITCH_LABEL_TEXT = 'Switch label'

describe('ToggleSwitch', () => {
  implementsClassName(ToggleSwitch, classes.ToggleSwitch)
  it.each([
    ['compact', 30, 16],
    ['small', 40, 20],
    ['medium', 48, 24],
  ] as const)('keeps the %s thumb inside the control in both directions', async (size, width, height) => {
    const {rerender} = render(
      <div dir="ltr">
        <span id="size-label">Size preview</span>
        <ToggleSwitch size={size} aria-labelledby="size-label" />
      </div>,
    )
    for (const direction of ['ltr', 'rtl']) {
      rerender(
        <div dir={direction}>
          <span id="size-label">Size preview</span>
          <ToggleSwitch size={size} aria-labelledby="size-label" />
        </div>,
      )
      const button = page.getByRole('button', {name: 'Size preview', exact: true})
      await expect.element(button).toHaveStyle({width: `${width}px`, height: `${height}px`})
      for (let toggle = 0; toggle < 2; toggle++) {
        await browserUserEvent.click(button)
        await expect
          .poll(() => {
            const track = button.element().getBoundingClientRect()
            const thumb = button.element().lastElementChild?.getBoundingClientRect()
            if (!thumb) return false
            const checked = button.element().getAttribute('aria-pressed') === 'true'
            const inset = direction === 'ltr' ? thumb.left - track.left : track.right - thumb.right
            const indicator = button.element().querySelectorAll('svg')[checked ? 0 : 1].getBoundingClientRect()
            const indicatorInset = checked
              ? direction === 'ltr'
                ? indicator.left - track.left
                : track.right - indicator.right
              : direction === 'ltr'
                ? track.right - indicator.right
                : indicator.left - track.left
            return (
              Math.abs(inset - (checked ? (size === 'compact' ? 12 : 14) : 2)) < 0.1 &&
              Math.abs(indicatorInset - (checked ? (size === 'compact' ? 6 : 7) : 4)) < 0.1 &&
              indicator.width === (checked ? 2 : size === 'compact' ? 6 : size === 'small' ? 8 : 10)
            )
          })
          .toBe(true)
      }
    }
  })

  it.each([false, true])('keeps the %s state colors when the switch is disabled', async checked => {
    const renderSwitch = (disabled: boolean) => (
      <>
        <span id="disabled-colors-label">Preference</span>
        <ToggleSwitch checked={checked} disabled={disabled} aria-labelledby="disabled-colors-label" />
      </>
    )
    const {rerender} = render(renderSwitch(false))
    const button = page.getByRole('button', {name: 'Preference', exact: true})
    const trackStyles = getComputedStyle(button.element())
    const thumb = button.element().lastElementChild
    if (!(thumb instanceof HTMLElement)) throw new Error('Missing switch thumb')
    const enabled = {
      backgroundImage: trackStyles.backgroundImage,
      backgroundPosition: trackStyles.backgroundPosition,
      thumbColor: getComputedStyle(thumb).backgroundColor,
    }
    rerender(renderSwitch(true))
    await expect.element(button).toHaveAttribute('aria-disabled', 'true')
    await expect.element(button).toHaveStyle({
      opacity: '0.6',
      backgroundImage: enabled.backgroundImage,
      backgroundPosition: enabled.backgroundPosition,
    })
    expect(getComputedStyle(thumb).backgroundColor).toBe(enabled.thumbColor)
  })

  it('toggles a compact control with the keyboard and keeps custom state labels', async () => {
    render(
      <>
        <span id="compact-label">Compact preference</span>
        <ToggleSwitch
          size="compact"
          aria-labelledby="compact-label"
          buttonLabelOn="Enabled"
          buttonLabelOff="Disabled"
        />
      </>,
    )
    const button = page.getByRole('button', {name: 'Compact preference', exact: true})
    await browserUserEvent.tab()
    await expect.element(button).toHaveFocus()
    await browserUserEvent.keyboard(' ')
    await expect.element(button).toHaveAttribute('aria-pressed', 'true')
    await expect.element(page.getByText('Enabled', {exact: true})).toBeVisible()
    await browserUserEvent.keyboard('{Enter}')
    await expect.element(button).toHaveAttribute('aria-pressed', 'false')
    await expect.element(page.getByText('Disabled', {exact: true})).toBeVisible()
  })
  it('renders a switch that is turned off', () => {
    const {getByLabelText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders a switch that is turned on', () => {
    const {getByLabelText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" defaultChecked />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true')
  })

  it('uses custom On text', () => {
    const {getByText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch buttonLabelOn="Engaged" aria-labelledby="switchLabel" defaultChecked />
      </>,
    )
    expect(getByText('Engaged')).toBeInTheDocument()
  })

  it('uses custom Off text', () => {
    const {getByText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch buttonLabelOff="Deactivated" aria-labelledby="switchLabel" />
      </>,
    )
    expect(getByText('Deactivated')).toBeInTheDocument()
  })

  it('renders a switch that is disabled', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" disabled />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggleSwitch)
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders a switch whose state is loading', async () => {
    const user = userEvent.setup()
    const {getByLabelText, container} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" loading />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)
    const loadingSpinner = container.querySelector('svg')

    expect(loadingSpinner).toBeDefined()
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggleSwitch)
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches from off to on uncontrolled', async () => {
    const user = userEvent.setup()
    const {getByLabelText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggleSwitch)
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches from off to on uncontrolled when clicking on status label', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)
    const toggleSwitchStatusLabel = getByText('Off')

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggleSwitchStatusLabel)
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true')
  })

  it('ensures the status label cannot toggle a disabled switch', async () => {
    const user = userEvent.setup()
    const {getByLabelText, getByText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" disabled />
      </>,
    )
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)
    const toggleSwitchStatusLabel = getByText('Off')

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggleSwitchStatusLabel)
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches from off to on with a controlled prop', async () => {
    const user = userEvent.setup()
    const ControlledSwitchComponent = () => {
      const [isOn, setIsOn] = React.useState(false)

      const onClick = () => {
        setIsOn(!isOn)
      }

      return (
        <>
          <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
          <ToggleSwitch onClick={onClick} checked={isOn} aria-labelledby="switchLabel" />
        </>
      )
    }
    const {getByLabelText} = render(<ControlledSwitchComponent />)
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'false')
    await user.click(toggleSwitch)
    expect(toggleSwitch).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange when the switch is toggled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const ControlledSwitchComponent = ({handleSwitchChange}: {handleSwitchChange: (on: boolean) => void}) => {
      const [isOn, setIsOn] = React.useState(false)

      const onClick = () => {
        setIsOn(!isOn)
      }

      return (
        <>
          <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
          <ToggleSwitch onClick={onClick} onChange={handleSwitchChange} checked={isOn} aria-labelledby="switchLabel" />
        </>
      )
    }
    const {getByLabelText} = render(<ControlledSwitchComponent handleSwitchChange={handleChange} />)
    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

    await user.click(toggleSwitch)
    expect(handleChange).toHaveBeenCalledWith(true)
  })

  it('does not call onChange on mount or when checked changes externally', () => {
    const handleChange = vi.fn()
    const {rerender} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch checked={false} onChange={handleChange} aria-labelledby="switchLabel" />
      </>,
    )
    expect(handleChange).not.toHaveBeenCalled()

    rerender(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch checked={true} onChange={handleChange} aria-labelledby="switchLabel" />
      </>,
    )
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('does not call onChange when a new inline onChange is passed on rerender', () => {
    const handleChange = vi.fn()
    const {rerender} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch checked={false} onChange={() => handleChange()} aria-labelledby="switchLabel" />
      </>,
    )
    expect(handleChange).not.toHaveBeenCalled()

    // A new `onChange` identity each render previously re-ran the effect and
    // fired the callback; it must not be called without a user interaction.
    rerender(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch checked={false} onChange={() => handleChange()} aria-labelledby="switchLabel" />
      </>,
    )
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('can pass data attributes to the rendered component', async () => {
    const TEST_ID = 'a test id'
    const ControlledSwitchComponent = () => {
      return (
        <>
          <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
          <ToggleSwitch data-testid={TEST_ID} defaultChecked aria-labelledby="switchLabel" />
        </>
      )
    }
    const {getByTestId} = render(<ControlledSwitchComponent />)
    const toggleSwitch = getByTestId(TEST_ID)
    expect(toggleSwitch).toBeInTheDocument()
  })

  it('renders a switch that has button type button', () => {
    const {getByLabelText} = render(
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <ToggleSwitch aria-labelledby="switchLabel" />
      </>,
    )

    const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)
    expect(toggleSwitch).toHaveAttribute('type', 'button')
  })

  it('supports a `ref` on the inner <button> element', () => {
    const ref = vi.fn()

    render(
      <>
        <span id="label">label</span>
        <ToggleSwitch ref={ref} aria-labelledby="label" />
      </>,
    )

    expect(ref).toHaveBeenCalled()
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement))
  })

  it('displays a loading label', async () => {
    const TEST_ID = 'a test id'

    const {getByTestId} = render(
      <>
        <span id="label">label</span>
        <ToggleSwitch data-testid={TEST_ID} aria-labelledby="label" loadingLabelDelay={0} loading />
      </>,
    )

    const toggleSwitch = getByTestId(TEST_ID)
    await waitFor(() => expect(toggleSwitch).toHaveTextContent('Loading'))
  })
})
