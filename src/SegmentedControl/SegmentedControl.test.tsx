import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import MatchMediaMock from 'jest-matchmedia-mock'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {SegmentedControl} from '.' // TODO: update import when we move this to the global index
import theme from '../theme'
import {BaseStyles, SSRProvider, ThemeProvider} from '..'
import {act} from 'react-test-renderer'
import {viewportRanges} from '../hooks/useResponsiveValue'

const segmentData = [
  {label: 'Preview', id: 'preview', iconLabel: 'EyeIcon', icon: () => <EyeIcon aria-label="EyeIcon" />},
  {label: 'Raw', id: 'raw', iconLabel: 'FileCodeIcon', icon: () => <FileCodeIcon aria-label="FileCodeIcon" />},
  {label: 'Blame', id: 'blame', iconLabel: 'PeopleIcon', icon: () => <PeopleIcon aria-label="PeopleIcon" />}
]

let matchMedia: MatchMediaMock

describe('SegmentedControl', () => {
  const mockWarningFn = jest.fn()

  beforeAll(() => {
    jest.spyOn(global.console, 'warn').mockImplementation(mockWarningFn)
    matchMedia = new MatchMediaMock()
  })

  afterAll(() => {
    jest.clearAllMocks()
    matchMedia.clear()
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

  it('renders the dropdown variant', () => {
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })

    const {getByText} = render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )
    const button = getByText(segmentData[1].label)

    expect(button).toBeInTheDocument()
    expect(button.closest('button')?.getAttribute('aria-haspopup')).toBe('true')
  })

  it('renders the hideLabels variant', () => {
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })

    const {getByLabelText} = render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels'}}>
        {segmentData.map(({label, icon}, index) => (
          <SegmentedControl.Button leadingIcon={icon} selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    for (const datum of segmentData) {
      const labelledButton = getByLabelText(datum.label)
      expect(labelledButton).toBeDefined()
    }
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

  it('calls onChange with index of clicked segment button', async () => {
    const user = userEvent.setup()
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
      await user.click(buttonToClick)
    }
    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('calls segment button onClick if it is passed', async () => {
    const user = userEvent.setup()
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
      await user.click(buttonToClick)
    }
    expect(handleClick).toHaveBeenCalled()
  })

  it('focuses the selected button first', async () => {
    const user = userEvent.setup()
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

    await user.tab() // focus the button before the segmented control
    await user.tab() // move focus into the segmented control

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

  it('calls onChange with index of clicked segment button when using the dropdown variant', async () => {
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })
    const handleChange = jest.fn()
    const component = render(
      <ThemeProvider theme={theme}>
        <SSRProvider>
          <BaseStyles>
            <SegmentedControl aria-label="File view" onChange={handleChange} variant={{narrow: 'dropdown'}}>
              {segmentData.map(({label}, index) => (
                <SegmentedControl.Button selected={index === 0} key={label}>
                  {label}
                </SegmentedControl.Button>
              ))}
            </SegmentedControl>
          </BaseStyles>
        </SSRProvider>
      </ThemeProvider>
    )
    const button = component.getByText(segmentData[0].label)

    fireEvent.click(button)
    expect(handleChange).not.toHaveBeenCalled()
    const menuItems = await waitFor(() => component.getAllByRole('menuitemradio'))
    fireEvent.click(menuItems[1])

    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('calls segment button onClick if it is passed when using the dropdown variant', async () => {
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })
    const handleClick = jest.fn()
    const component = render(
      <ThemeProvider theme={theme}>
        <SSRProvider>
          <BaseStyles>
            <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
              {segmentData.map(({label}, index) => (
                <SegmentedControl.Button selected={index === 0} key={label} onClick={handleClick}>
                  {label}
                </SegmentedControl.Button>
              ))}
            </SegmentedControl>
          </BaseStyles>
        </SSRProvider>
      </ThemeProvider>
    )
    const button = component.getByText(segmentData[0].label)

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
    const menuItems = await waitFor(() => component.getAllByRole('menuitemradio'))
    fireEvent.click(menuItems[1])

    expect(handleClick).toHaveBeenCalled()
  })

  it('warns users if they try to use the hideLabels variant without a leadingIcon', () => {
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })
    const consoleSpy = jest.spyOn(global.console, 'warn')
    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )
    expect(consoleSpy).toHaveBeenCalled()
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

// TODO: uncomment these tests after we fix a11y for the Tooltip component
// checkStoriesForAxeViolations('examples', '../SegmentedControl/')
checkStoriesForAxeViolations('fixtures', '../SegmentedControl/')
