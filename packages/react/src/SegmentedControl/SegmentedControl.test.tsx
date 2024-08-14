import React from 'react'
import MatchMediaMock from 'jest-matchmedia-mock'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {SegmentedControl} from '.' // TODO: update import when we move this to the global index
import theme from '../theme'
import {BaseStyles, ThemeProvider} from '..'
import {act} from 'react-test-renderer'
import {viewportRanges} from '../hooks/useResponsiveValue'

const segmentData = [
  {label: 'Preview', id: 'preview', iconLabel: 'EyeIcon', icon: () => <EyeIcon aria-label="EyeIcon" />},
  {label: 'Raw', id: 'raw', iconLabel: 'FileCodeIcon', icon: () => <FileCodeIcon aria-label="FileCodeIcon" />},
  {label: 'Blame', id: 'blame', iconLabel: 'PeopleIcon', icon: () => <PeopleIcon aria-label="PeopleIcon" />},
]

let matchMedia: MatchMediaMock

describe('SegmentedControl', () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock()
  })

  afterAll(() => {
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
    ),
  })

  checkExports('SegmentedControl', {
    default: undefined,
    SegmentedControl,
  })

  it('renders with a selected segment - controlled', () => {
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const selectedButton = getByText('Raw').closest('button')

    expect(selectedButton?.getAttribute('aria-current')).toBe('true')
  })

  it('renders with a selected segment - uncontrolled', () => {
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button defaultSelected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
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
      </SegmentedControl>,
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
      </SegmentedControl>,
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
      </SegmentedControl>,
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
      </SegmentedControl>,
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
      </SegmentedControl>,
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
      </SegmentedControl>,
    )

    const buttonToClick = getByText('Raw').closest('button')

    expect(handleChange).not.toHaveBeenCalled()
    if (buttonToClick) {
      await user.click(buttonToClick)
    }
    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('changes selection to the clicked segment even without onChange being passed', async () => {
    const user = userEvent.setup()
    const {getByText} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}) => (
          <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const buttonToClick = getByText('Raw').closest('button')

    expect(buttonToClick?.getAttribute('aria-current')).toBe('false')
    if (buttonToClick) {
      await user.click(buttonToClick)
    }
    expect(buttonToClick?.getAttribute('aria-current')).toBe('true')
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
      </SegmentedControl>,
    )

    const buttonToClick = getByText('Raw').closest('button')

    expect(handleClick).not.toHaveBeenCalled()
    if (buttonToClick) {
      await user.click(buttonToClick)
    }
    expect(handleClick).toHaveBeenCalled()
  })

  it('calls onChange with index of clicked segment button when using the dropdown variant', async () => {
    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })
    const handleChange = jest.fn()
    const component = render(
      <ThemeProvider theme={theme}>
        <BaseStyles>
          <SegmentedControl aria-label="File view" onChange={handleChange} variant={{narrow: 'dropdown'}}>
            {segmentData.map(({label}, index) => (
              <SegmentedControl.Button selected={index === 0} key={label}>
                {label}
              </SegmentedControl.Button>
            ))}
          </SegmentedControl>
        </BaseStyles>
      </ThemeProvider>,
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
        <BaseStyles>
          <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
            {segmentData.map(({label}, index) => (
              <SegmentedControl.Button selected={index === 0} key={label} onClick={handleClick}>
                {label}
              </SegmentedControl.Button>
            ))}
          </SegmentedControl>
        </BaseStyles>
      </ThemeProvider>,
    )
    const button = component.getByText(segmentData[0].label)

    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
    const menuItems = await waitFor(() => component.getAllByRole('menuitemradio'))
    fireEvent.click(menuItems[1])

    expect(handleClick).toHaveBeenCalled()
  })

  it('warns users if they try to use the hideLabels variant without a leadingIcon', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation()

    act(() => {
      matchMedia.useMediaQuery(viewportRanges.narrow)
    })

    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    expect(spy).toHaveBeenCalledTimes(3)
    spy.mockRestore()
  })

  it('should warn the user if they neglect to specify a label for the segmented control', () => {
    const spy = jest.spyOn(global.console, 'warn').mockImplementation()

    render(
      <SegmentedControl>
        {segmentData.map(({label, id}) => (
          <SegmentedControl.Button id={id} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    expect(spy).toHaveBeenCalledTimes(2)
    spy.mockRestore()
  })
})

// TODO: uncomment these tests after we fix a11y for the Tooltip component
// checkStoriesForAxeViolations('examples', '../SegmentedControl/')
// checkStoriesForAxeViolations('SegmentedControlFeatures', '../SegmentedControl/')
