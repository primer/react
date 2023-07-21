import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {ToggleSwitch} from '..'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import userEvent from '@testing-library/user-event'

const SWITCH_LABEL_TEXT = 'Switch label'

behavesAsComponent({
  Component: ToggleSwitch,
  options: {skipAs: true},
})
checkExports('ToggleSwitch', {
  default: ToggleSwitch,
})
it('renders a switch that is turned off', () => {
  const {getByLabelText} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <ToggleSwitch aria-labelledby="switchLabel" />
    </>,
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
})
it('renders a switch that is turned on', () => {
  const {getByLabelText} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <ToggleSwitch aria-labelledby="switchLabel" defaultChecked />
    </>,
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'true')
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

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  await user.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
})
it("renders a switch who's state is loading", async () => {
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
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  await user.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
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

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  await user.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'true')
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

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  await user.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'true')
})
it('calls onChange when the switch is toggled', async () => {
  const user = userEvent.setup()
  const handleChange = jest.fn()
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

checkStoriesForAxeViolations('ToggleSwitch.features', '../ToggleSwitch/')
