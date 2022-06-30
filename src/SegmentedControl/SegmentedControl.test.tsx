import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent, waitFor} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {behavesAsComponent, checkExports, checkStoriesForAxeViolations} from '../utils/testing'
import {SegmentedControl} from '.' // TODO: update import when we move this to the global index
import theme from '../theme'
import {BaseStyles, SSRProvider, ThemeProvider} from '..'

const segmentData = [
  {label: 'Preview', iconLabel: 'EyeIcon', icon: () => <EyeIcon aria-label="EyeIcon" />},
  {label: 'Raw', iconLabel: 'FileCodeIcon', icon: () => <FileCodeIcon aria-label="FileCodeIcon" />},
  {label: 'Blame', iconLabel: 'PeopleIcon', icon: () => <PeopleIcon aria-label="PeopleIcon" />}
]

// TODO: improve test coverage
describe('SegmentedControl', () => {
  const mockWarningFn = jest.fn()

  beforeAll(() => {
    jest.spyOn(global.console, 'warn').mockImplementation(mockWarningFn)
  })

  afterAll(() => {
    jest.clearAllMocks()
  })

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  })

  behavesAsComponent({
    Component: SegmentedControl,
    toRender: () => (
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button selected>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
        <SegmentedControl.Button>Blame</SegmentedControl.Button>
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
    const {getByText} = render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown', regular: 'dropdown'}}>
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
    const {getByLabelText} = render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels', regular: 'hideLabels'}}>
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

  it('calls onChange with index of clicked segment button when using the dropdown variant', async () => {
    const handleChange = jest.fn()
    const component = render(
      <ThemeProvider theme={theme}>
        <SSRProvider>
          <BaseStyles>
            <SegmentedControl
              aria-label="File view"
              onChange={handleChange}
              variant={{narrow: 'dropdown', regular: 'dropdown'}}
            >
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
    const handleClick = jest.fn()
    const component = render(
      <ThemeProvider theme={theme}>
        <SSRProvider>
          <BaseStyles>
            <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown', regular: 'dropdown'}}>
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
    const consoleSpy = jest.spyOn(global.console, 'warn')

    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels', regular: 'hideLabels'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>
    )

    expect(consoleSpy).toHaveBeenCalled()
  })
})

// TODO: uncomment these tests after we fix a11y for the Tooltip component
// checkStoriesForAxeViolations('examples', '../SegmentedControl/')
checkStoriesForAxeViolations('fixtures', '../SegmentedControl/')
