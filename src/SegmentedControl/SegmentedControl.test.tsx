import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {fireEvent, render} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {SegmentedControl} from '.' // TODO: update import when we move this to the global index

const segmentData = [
  {label: 'Preview', id: 'preview', iconLabel: 'EyeIcon', icon: () => <EyeIcon aria-label="EyeIcon" />},
  {label: 'Raw', id: 'raw', iconLabel: 'FileCodeIcon', icon: () => <FileCodeIcon aria-label="FileCodeIcon" />},
  {label: 'Blame', id: 'blame', iconLabel: 'PeopleIcon', icon: () => <PeopleIcon aria-label="PeopleIcon" />}
]

// TODO: improve test coverage
describe('SegmentedControl', () => {
  const mockWarningFn = jest.fn()

  beforeAll(() => {
    jest.spyOn(global.console, 'warn').mockImplementation(mockWarningFn)
  })

  behavesAsComponent({
    Component: SegmentedControl,
    toRender: () => (
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 0} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )
  })

  checkExports('SegmentedControl', {
    default: undefined,
    SegmentedControl
  })

  it('renders with a selected segment', () => {
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    const selectedButton = getByText('Raw').closest('button')

    expect(selectedButton?.getAttribute('aria-current')).toBe('true')
  })

  it('renders the first segment as selected if no child has the `selected` prop passed', () => {
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}) => (
          <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    const selectedButton = getByText('Preview').closest('button')

    expect(selectedButton?.getAttribute('aria-current')).toBe('true')
  })

  it('renders segments with segment labels that have leading icons', () => {
    const {getByLabelText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}, index) => (
          <SegmentedControl.Button selected={index === 0} leadingIcon={icon} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    for (const datum of segmentData) {
      const iconEl = getByLabelText(datum.iconLabel)
      expect(iconEl).toBeDefined()
    }
  })

  it('renders segments with accessible icon-only labels', () => {
    const {getByLabelText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}) => (
          <SegmentedControl.IconButton icon={icon} aria-label={label} key={label} />
        ))}
      </SegmentedControl>
    )

    for (const datum of segmentData) {
      const labelledButton = getByLabelText(datum.label)
      expect(labelledButton).toBeDefined()
    }
  })

  it('calls onChange with index of clicked segment button', () => {
    const handleChange = jest.fn()
    const {getByText} = render(
      <SegmentedControl aria-label="File view" onChange={handleChange}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 0} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    const buttonToClick = getByText('Raw').closest('button')

    expect(handleChange).not.toHaveBeenCalled()
    if (buttonToClick) {
      userEvent.click(buttonToClick)
    }
    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('calls segment button onClick if it is passed', () => {
    const handleClick = jest.fn()
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 0} onClick={index === 1 ? handleClick : undefined} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    const buttonToClick = getByText('Raw').closest('button')

    expect(handleClick).not.toHaveBeenCalled()
    if (buttonToClick) {
      userEvent.click(buttonToClick)
    }
    expect(handleClick).toHaveBeenCalled()
  })

  it('focuses the selected button first', () => {
    const {getByRole} = render(
      <>
        <button>Before</button>
        <SegmentedControl aria-label="File view">
          {segmentData.map(({label, id}, index) => (
            <SegmentedControl.Button selected={index === 1} key={label} id={id}>
              {label}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
      </>
    )
    const initialFocusButtonNode = getByRole('button', {name: segmentData[1].label})

    expect(document.activeElement?.id).not.toEqual(initialFocusButtonNode.id)

    userEvent.tab() // focus the button before the segmented control
    userEvent.tab() // move focus into the segmented control

    expect(document.activeElement?.id).toEqual(initialFocusButtonNode.id)
  })

  it('focuses the previous button when keying ArrowLeft, and the next button when keying ArrowRight', () => {
    const {getByRole} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, id}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label} id={id}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )
    const initialFocusButtonNode = getByRole('button', {name: segmentData[1].label})
    const nextFocusButtonNode = getByRole('button', {name: segmentData[0].label})

    expect(document.activeElement?.id).not.toEqual(nextFocusButtonNode.id)

    fireEvent.focus(initialFocusButtonNode)
    fireEvent.keyDown(initialFocusButtonNode, {key: 'ArrowLeft'})

    expect(document.activeElement?.id).toEqual(nextFocusButtonNode.id)

    fireEvent.keyDown(initialFocusButtonNode, {key: 'ArrowRight'})

    expect(document.activeElement?.id).toEqual(initialFocusButtonNode.id)
  })

  it('should warn the user if they neglect to specify a label for the segmented control', () => {
    render(
      <SegmentedControl>
        {segmentData.map(({label, id}) => (
          <SegmentedControl.Button id={id} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    expect(mockWarningFn).toHaveBeenCalled()
  })
})

checkStoriesForAxeViolations('examples', '../SegmentedControl/')
checkStoriesForAxeViolations('fixtures', '../SegmentedControl/')
