import {describe, expect, it, vi} from 'vitest'
import React from 'react'
import {render, waitFor} from '@testing-library/react'
import ToggleSwitch from './'
import userEvent from '@testing-library/user-event'
import {implementsClassName} from '../utils/testing'
import classes from './ToggleSwitch.module.css'

const SWITCH_LABEL_TEXT = 'Switch label'

describe('ToggleSwitch', () => {
  implementsClassName(ToggleSwitch, classes.ToggleSwitch)
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
