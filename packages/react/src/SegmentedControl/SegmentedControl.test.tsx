import {render, fireEvent, waitFor} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import BaseStyles from '../BaseStyles'
import theme from '../theme'
import ThemeProvider from '../ThemeProvider'
import {FeatureFlags} from '../FeatureFlags'
import {SegmentedControl} from '../SegmentedControl'

const segmentData = [
  {
    label: 'Preview',
    description: 'This preview does blah.',
    id: 'preview',
    iconLabel: 'EyeIcon',
    icon: () => <EyeIcon aria-label="EyeIcon" />,
  },
  {
    label: 'Raw',
    description: 'This shows the raw content.',
    id: 'raw',
    iconLabel: 'FileCodeIcon',
    icon: () => <FileCodeIcon aria-label="FileCodeIcon" />,
  },
  {
    label: 'Blame',
    description: 'This shows the blame.',
    id: 'blame',
    iconLabel: 'PeopleIcon',
    icon: () => <PeopleIcon aria-label="PeopleIcon" />,
  },
]

describe('SegmentedControl', () => {
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

  it('renders icon button with tooltip as label when feature flag is enabled', () => {
    const {getByRole, getByText} = render(
      <FeatureFlags
        flags={{
          primer_react_segmented_control_tooltip: true,
        }}
      >
        <SegmentedControl aria-label="File view">
          {segmentData.map(({label, icon}) => (
            <SegmentedControl.IconButton icon={icon} aria-label={label} key={label} />
          ))}
        </SegmentedControl>
      </FeatureFlags>,
    )

    for (const datum of segmentData) {
      const labelledButton = getByRole('button', {name: datum.label})
      const tooltipElement = getByText(datum.label)
      expect(labelledButton).toHaveAttribute('aria-labelledby', tooltipElement.id)
      expect(labelledButton).not.toHaveAttribute('aria-label')
    }
  })

  it('renders icon button with tooltip description when feature flag is enabled', () => {
    const {getByRole, getByText} = render(
      <FeatureFlags
        flags={{
          primer_react_segmented_control_tooltip: true,
        }}
      >
        <SegmentedControl aria-label="File view">
          {segmentData.map(({label, icon, description}) => (
            <SegmentedControl.IconButton icon={icon} aria-label={label} description={description} key={label} />
          ))}
        </SegmentedControl>
      </FeatureFlags>,
    )

    for (const datum of segmentData) {
      const labelledButton = getByRole('button', {name: datum.label})
      const tooltipElement = getByText(datum.description)
      expect(labelledButton).toHaveAttribute('aria-describedby', tooltipElement.id)
      expect(labelledButton).toHaveAccessibleName(datum.label)
      expect(labelledButton).toHaveAttribute('aria-label', datum.label)
    }
  })

  it('renders icon button with aria-label and no tooltip', () => {
    const {getByRole} = render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}) => (
          <SegmentedControl.IconButton icon={icon} aria-label={label} key={label} />
        ))}
      </SegmentedControl>,
    )

    for (const datum of segmentData) {
      const labelledButton = getByRole('button', {name: datum.label})
      expect(labelledButton).toHaveAttribute('aria-label', datum.label)
    }
  })

  it('calls onChange with index of clicked segment button', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
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
    const handleClick = vi.fn()
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
    const handleChange = vi.fn()
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
    const handleClick = vi.fn()
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
    const spy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})

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
    const spy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})

    render(
      <SegmentedControl>
        {segmentData.map(({label, id}) => (
          <SegmentedControl.Button id={id} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('should include the visual text if the user specifies an aria-label', () => {
    const {getByLabelText} = render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 2} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const menuButton = getByLabelText('Blame, File view')
    expect(menuButton).toBeInTheDocument()
  })
})
