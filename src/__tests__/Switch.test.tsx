import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render} from '@testing-library/react'
import {Switch} from '..'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import userEvent from '@testing-library/user-event'

const SWITCH_LABEL_TEXT = 'Switch label'

behavesAsComponent({
  Component: Switch,
  options: {skipAs: true}
})
checkExports('Switch', {
  default: Switch
})
it('renders a switch that is turned off', () => {
  const {getByLabelText} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <Switch aria-labelledby="switchLabel" />
    </>
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
})
it('renders a switch that is turned on', () => {
  const {getByLabelText} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <Switch aria-labelledby="switchLabel" defaultOn />
    </>
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'true')
})
it('renders a switch that is disabled', () => {
  const {getByLabelText} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <Switch aria-labelledby="switchLabel" disabled />
    </>
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-disabled', 'true')
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  userEvent.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
})
it("renders a switch who's state is loading", () => {
  const {getByLabelText, container} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <Switch aria-labelledby="switchLabel" isLoading />
    </>
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)
  const loadingSpinner = container.querySelector('svg')

  expect(loadingSpinner).toBeDefined()
  expect(toggleSwitch).toHaveAttribute('aria-disabled', 'true')
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  userEvent.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
})
it('switches from off to on uncontrolled', () => {
  const {getByLabelText} = render(
    <>
      <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
      <Switch aria-labelledby="switchLabel" />
    </>
  )
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  userEvent.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'true')
})
it('switches from off to on with a controlled prop', () => {
  const ControlledSwitchComponent = () => {
    const [isOn, setIsOn] = React.useState(false)

    const onClick = () => {
      setIsOn(!isOn)
    }

    return (
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <Switch onClick={onClick} on={isOn} aria-labelledby="switchLabel" />
      </>
    )
  }
  const {getByLabelText} = render(<ControlledSwitchComponent />)
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  expect(toggleSwitch).toHaveAttribute('aria-checked', 'false')
  userEvent.click(toggleSwitch)
  expect(toggleSwitch).toHaveAttribute('aria-checked', 'true')
})
it('calls onChange when the switch is toggled', () => {
  const handleChange = jest.fn()
  const ControlledSwitchComponent = ({handleSwitchChange}: {handleSwitchChange: (on: boolean) => void}) => {
    const [isOn, setIsOn] = React.useState(false)

    const onClick = () => {
      setIsOn(!isOn)
    }

    return (
      <>
        <div id="switchLabel">{SWITCH_LABEL_TEXT}</div>
        <Switch onClick={onClick} onChange={handleSwitchChange} on={isOn} aria-labelledby="switchLabel" />
      </>
    )
  }
  const {getByLabelText} = render(<ControlledSwitchComponent handleSwitchChange={handleChange} />)
  const toggleSwitch = getByLabelText(SWITCH_LABEL_TEXT)

  userEvent.click(toggleSwitch)
  expect(handleChange).toHaveBeenCalledWith(true)
})

checkStoriesForAxeViolations('Switch/fixtures')
checkStoriesForAxeViolations('Switch/examples')
