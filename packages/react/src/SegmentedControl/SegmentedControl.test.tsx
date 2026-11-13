import {act, render} from '@testing-library/react'
import {EyeIcon, FileCodeIcon, PeopleIcon, PlusIcon} from '@primer/octicons-react'
import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, vi} from 'vitest'
import BaseStyles from '../BaseStyles'
import {SegmentedControl} from '../SegmentedControl'
import {implementsClassName} from '../utils/testing'
import {asSlot} from '../utils/as-slot'
import classes from './SegmentedControl.module.css'

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
  implementsClassName(props => <SegmentedControl aria-label="File view" {...props} />, classes.SegmentedControl)

  it('renders data-component attribute on the root', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}) => (
          <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    await expect.element(page.getByRole('list')).toHaveAttribute('data-component', 'SegmentedControl')
  })

  it('renders the subtle variant', async () => {
    render(
      <SegmentedControl aria-label="File view" variant="subtle">
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await expect.element(page.getByRole('list')).toHaveAttribute('data-variant', 'subtle')
  })

  it('renders the subtle variant responsively', async () => {
    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown', regular: 'subtle', wide: 'subtle'}}>
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
      </SegmentedControl>,
    )
    const list = page.getByRole('list', {includeHidden: true})

    await expect.element(list).toHaveAttribute('data-variant-narrow', 'dropdown')
    await expect.element(list).toHaveAttribute('data-variant-regular', 'subtle')
    await expect.element(list).toHaveAttribute('data-variant-wide', 'subtle')
  })

  it('renders data-component attribute on segmented control buttons', async () => {
    render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button>Preview</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await expect.element(page.getByRole('listitem')).toHaveAttribute('data-component', 'SegmentedControl.Button')
  })

  it('renders dividers without including them in selection indices', async () => {
    const onChange = vi.fn()
    const {container} = render(
      <SegmentedControl aria-label="File view" variant="subtle" onChange={onChange}>
        <SegmentedControl.Button>Preview</SegmentedControl.Button>
        <SegmentedControl.Divider />
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SegmentedControl.Divider"]'))
      .toBeInTheDocument()
    await userEvent.click(page.getByRole('button', {name: 'Raw'}))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('renders wrapped dividers in the segmented control and dropdown', async () => {
    const onChange = vi.fn()
    const WrappedDivider = asSlot(() => <SegmentedControl.Divider />, SegmentedControl.Divider)
    const {container} = render(
      <SegmentedControl
        aria-label="File view"
        variant={{narrow: 'dropdown', regular: 'subtle', wide: 'subtle'}}
        onChange={onChange}
      >
        <SegmentedControl.Button>Preview</SegmentedControl.Button>
        <WrappedDivider />
        <SegmentedControl.Button>Raw</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await expect
      .element(container.querySelector<HTMLElement>('[data-component="SegmentedControl.Divider"]'))
      .toBeInTheDocument()
    await userEvent.click(page.getByRole('button', {name: 'Preview, File view'}))
    await expect
      .element(document.querySelector<HTMLElement>('[data-component="ActionList.Divider"]'))
      .toBeInTheDocument()
    await userEvent.click(page.getByRole('menuitemradio', {name: 'Raw'}))
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('renders data-component attribute on segmented control icon buttons', async () => {
    render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.IconButton icon={() => <EyeIcon />} aria-label="Preview" />
      </SegmentedControl>,
    )

    await expect
      .element(page.getByRole('button', {name: 'Preview'}).element().closest<HTMLElement>('li'))
      .toHaveAttribute('data-component', 'SegmentedControl.IconButton')
  })

  it('renders with a selected segment - controlled', () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const selectedButton = page.getByText('Raw', {exact: true}).element().closest<HTMLElement>('button')

    expect(selectedButton?.getAttribute('aria-pressed')).toBe('true')
  })

  it('renders with a selected segment - uncontrolled', () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button defaultSelected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const selectedButton = page.getByText('Raw', {exact: true}).element().closest<HTMLElement>('button')

    expect(selectedButton?.getAttribute('aria-pressed')).toBe('true')
  })

  it('renders the dropdown variant', async () => {
    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )
    const button = page.getByRole('button', {name: `${segmentData[1].label}, File view`})

    await expect.element(button).toBeInTheDocument()
    await expect.element(button).toHaveAttribute('aria-haspopup', 'true')
  })

  it('renders the hideLabels variant', async () => {
    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'hideLabels'}}>
        {segmentData.map(({label, icon}, index) => (
          <SegmentedControl.Button leadingVisual={icon} selected={index === 1} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    for (const datum of segmentData) {
      const labelledButton = page.getByRole('button', {name: datum.iconLabel})
      await expect.element(labelledButton).toBeInTheDocument()
    }
  })

  it('renders the first segment as selected if no child has the `selected` prop passed', () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}) => (
          <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const selectedButton = page.getByText('Preview', {exact: true}).element().closest<HTMLElement>('button')
    if (!selectedButton) {
      throw new Error('Expected selected button')
    }

    expect(selectedButton.getAttribute('aria-pressed')).toBe('true')
  })

  it('renders segments with segment labels that have leading icons', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}, index) => (
          <SegmentedControl.Button selected={index === 0} leadingVisual={icon} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    for (const datum of segmentData) {
      const iconEl = page.getByLabelText(datum.iconLabel)
      await expect.element(iconEl).toBeInTheDocument()
    }
  })

  it('renders segments with accessible icon-only labels', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}) => (
          <SegmentedControl.IconButton icon={icon} aria-label={label} key={label} />
        ))}
      </SegmentedControl>,
    )

    for (const datum of segmentData) {
      const labelledButton = page.getByLabelText(datum.label)
      await expect.element(labelledButton).toBeInTheDocument()
    }
  })

  it.each(['small', 'medium'] as const)('keeps icon buttons inside a shrinking flex row (%s)', async size => {
    render(
      <div style={{display: 'flex', width: 100}}>
        <div style={{flex: '1 1 100px', minWidth: 0}}>Filters</div>
        <SegmentedControl aria-label="File view" size={size}>
          <SegmentedControl.IconButton aria-label="Preview" icon={EyeIcon} />
          <SegmentedControl.IconButton aria-label="Code" icon={FileCodeIcon} />
        </SegmentedControl>
      </div>,
    )
    const control = page.getByRole('list').element()
    const row = control.parentElement!
    const bounds = control.getBoundingClientRect()

    expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth)
    for (const button of control.querySelectorAll('button')) {
      const rect = button.getBoundingClientRect()
      expect(rect.width).toBe(32)
      expect(rect.left).toBeGreaterThanOrEqual(bounds.left)
      expect(rect.right).toBeLessThanOrEqual(bounds.right)
    }

    const code = page.getByRole('button', {name: 'Code', exact: true})
    await userEvent.click(code)
    await expect.element(code).toHaveAttribute('aria-pressed', 'true')
    expect(control.getBoundingClientRect().toJSON()).toEqual(bounds.toJSON())
    expect(control.getBoundingClientRect().height).toBe(size === 'small' ? 28 : 32)
  })

  it('renders IconButton with aria-pressed when selected', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}, index) => (
          <SegmentedControl.IconButton icon={icon} aria-label={label} selected={index === 1} key={label} />
        ))}
      </SegmentedControl>,
    )

    await expect.element(page.getByRole('button', {name: 'Raw'})).toHaveAttribute('aria-pressed', 'true')
    await expect.element(page.getByRole('button', {name: 'Preview'})).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders icon button with tooltip as label', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon}) => (
          <SegmentedControl.IconButton icon={icon} aria-label={label} key={label} />
        ))}
      </SegmentedControl>,
    )

    for (const datum of segmentData) {
      const labelledButton = page.getByRole('button', {name: datum.label})
      const tooltipElement = page.getByText(datum.label, {exact: true})
      await expect.element(labelledButton).toHaveAttribute('aria-labelledby', tooltipElement.element().id)
      await expect.element(labelledButton).not.toHaveAttribute('aria-label')
    }
  })

  it('renders icon button with tooltip description', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label, icon, description}) => (
          <SegmentedControl.IconButton icon={icon} aria-label={label} description={description} key={label} />
        ))}
      </SegmentedControl>,
    )

    for (const datum of segmentData) {
      const labelledButton = page.getByRole('button', {name: datum.label})
      const tooltipElement = page.getByText(datum.description, {exact: true})
      await expect.element(labelledButton).toHaveAttribute('aria-describedby', tooltipElement.element().id)
      await expect.element(labelledButton).toHaveAccessibleName(datum.label)
      await expect.element(labelledButton).toHaveAttribute('aria-label', datum.label)
    }
  })

  it('calls onChange with index of clicked segment button', async () => {
    const handleChange = vi.fn()
    render(
      <SegmentedControl aria-label="File view" onChange={handleChange}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 0} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const buttonToClick = page.getByRole('button', {name: /Raw/})

    expect(handleChange).not.toHaveBeenCalled()
    await userEvent.click(buttonToClick)
    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('changes selection to the clicked segment even without onChange being passed', async () => {
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}) => (
          <SegmentedControl.Button key={label}>{label}</SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const buttonToClick = page.getByRole('button', {name: /Raw/})

    await expect.element(buttonToClick).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(buttonToClick)
    await expect.element(buttonToClick).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls segment button onClick if it is passed', async () => {
    const handleClick = vi.fn()
    render(
      <SegmentedControl aria-label="File view">
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 0} onClick={index === 1 ? handleClick : undefined} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const buttonToClick = page.getByRole('button', {name: /Raw/})

    expect(handleClick).not.toHaveBeenCalled()
    await userEvent.click(buttonToClick)
    expect(handleClick).toHaveBeenCalled()
  })

  it('calls onChange with index of clicked segment button when using the dropdown variant', async () => {
    const handleChange = vi.fn()
    render(
      <BaseStyles>
        <SegmentedControl aria-label="File view" onChange={handleChange} variant={{narrow: 'dropdown'}}>
          {segmentData.map(({label}, index) => (
            <SegmentedControl.Button selected={index === 0} key={label}>
              {label}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
      </BaseStyles>,
    )
    const button = page.getByRole('button', {name: `${segmentData[0].label}, File view`})

    await userEvent.click(button)
    expect(handleChange).not.toHaveBeenCalled()
    await userEvent.click(page.getByRole('menuitemradio', {name: 'Raw'}))

    expect(handleChange).toHaveBeenCalledWith(1)
  })

  it('calls segment button onClick if it is passed when using the dropdown variant', async () => {
    const handleClick = vi.fn()
    render(
      <BaseStyles>
        <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
          {segmentData.map(({label}, index) => (
            <SegmentedControl.Button selected={index === 0} key={label} onClick={handleClick}>
              {label}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
      </BaseStyles>,
    )
    const button = page.getByRole('button', {name: `${segmentData[0].label}, File view`})

    await userEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
    await userEvent.click(page.getByRole('menuitemradio', {name: 'Raw'}))

    expect(handleClick).toHaveBeenCalled()
  })

  it('renders the action as a labeled menu item after a divider in the dropdown', async () => {
    const handleAddView = vi.fn()
    render(
      <BaseStyles>
        <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
          <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
          <SegmentedControl.Button>Raw</SegmentedControl.Button>
          <SegmentedControl.Action label="Add view" icon={PlusIcon} onClick={handleAddView} />
        </SegmentedControl>
      </BaseStyles>,
    )

    await userEvent.click(page.getByRole('button', {name: 'Preview, File view'}))

    const menuAction = page.getByRole('menuitem', {name: 'Add view'})
    await expect.element(menuAction).toBeInTheDocument()
    const menuActionItem = menuAction.element().closest<HTMLElement>('[data-component="ActionList.Item"]')
    expect(menuActionItem?.previousElementSibling?.getAttribute('data-component')).toBe('ActionList.Divider')
    await expect.element(menuAction).toHaveAttribute('data-component', 'SegmentedControl.Action')

    await userEvent.click(menuAction)

    expect(handleAddView).toHaveBeenCalledExactlyOnceWith()
    await expect.element(page.getByRole('menu')).toBeInTheDocument()
  })

  it('renders a wrapped action slot in the dropdown', async () => {
    const handleAddView = vi.fn()
    const AddViewAction = asSlot(
      () => <SegmentedControl.Action label="Add view" icon={PlusIcon} onClick={handleAddView} />,
      SegmentedControl.Action,
    )
    render(
      <BaseStyles>
        <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
          <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
          <AddViewAction />
        </SegmentedControl>
      </BaseStyles>,
    )

    await userEvent.click(page.getByRole('button', {name: 'Preview, File view'}))
    await userEvent.click(page.getByRole('menuitem', {name: 'Add view'}))

    expect(handleAddView).toHaveBeenCalledOnce()
  })

  it('applies responsive full-width attributes to the layout wrapper', async () => {
    render(
      <SegmentedControl aria-label="File view" fullWidth={{narrow: true, regular: false}}>
        <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
        <SegmentedControl.Action label="Add view" icon={PlusIcon} />
      </SegmentedControl>,
    )

    await expect
      .element(page.getByRole('list').element().parentElement)
      .toHaveAttribute('data-full-width-narrow', 'true')
    await expect
      .element(page.getByRole('list').element().parentElement)
      .toHaveAttribute('data-full-width-regular', 'false')
  })

  it('calls the action from the icon action button', async () => {
    const handleAddView = vi.fn()
    render(
      <BaseStyles>
        <SegmentedControl aria-label="File view">
          <SegmentedControl.Button defaultSelected count={5}>
            All
          </SegmentedControl.Button>
          <SegmentedControl.Button count={3}>Active</SegmentedControl.Button>
          <SegmentedControl.Button count={10}>Review requests</SegmentedControl.Button>
          <SegmentedControl.Action label="Add view" icon={PlusIcon} onClick={handleAddView} />
        </SegmentedControl>
      </BaseStyles>,
    )

    await expect.element(page.getByRole('button', {pressed: true})).toHaveAccessibleName('All (5)')
    const iconActionButton = page.getByRole('button', {name: 'Add view'})

    await expect
      .element(iconActionButton.element().parentElement?.closest<HTMLElement>('[data-component]') ?? null)
      .toHaveAttribute('data-component', 'SegmentedControl.Action')

    await userEvent.click(iconActionButton)

    expect(handleAddView).toHaveBeenCalledExactlyOnceWith()
  })

  it('disables the knob transition while the number of rendered segments changes', async () => {
    let animationFrameCallback: FrameRequestCallback | undefined
    const requestAnimationFrameSpy = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(callback => {
      animationFrameCallback = callback
      return 1
    })
    const {rerender} = render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected>All</SegmentedControl.Button>
        <SegmentedControl.Button>Active</SegmentedControl.Button>
        {false}
      </SegmentedControl>,
    )

    rerender(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button defaultSelected>All</SegmentedControl.Button>
        <SegmentedControl.Button>Active</SegmentedControl.Button>
        <SegmentedControl.Button>New view</SegmentedControl.Button>
      </SegmentedControl>,
    )

    await expect.element(page.getByRole('list')).toHaveAttribute('data-disable-knob-transition', '')

    act(() => animationFrameCallback?.(0))

    await expect.element(page.getByRole('list')).not.toHaveAttribute('data-disable-knob-transition')
    requestAnimationFrameSpy.mockRestore()
  })

  it('supports deprecated leadingIcon prop for backward compatibility', async () => {
    render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button leadingIcon={EyeIcon}>Preview</SegmentedControl.Button>
        <SegmentedControl.Button>Code</SegmentedControl.Button>
      </SegmentedControl>,
    )

    const button = page.getByText('Preview', {exact: true}).element().closest<HTMLElement>('button')
    if (!button) {
      throw new Error('Expected button')
    }
    await expect.element(button).toBeInTheDocument()
    // Verify the icon is rendered
    const icon = button.querySelector<SVGSVGElement>('svg')
    if (!icon) {
      throw new Error('Expected icon')
    }
    await expect.element(icon).toBeInTheDocument()
  })

  it('prioritizes leadingVisual over deprecated leadingIcon when both are provided', async () => {
    render(
      <SegmentedControl aria-label="File view">
        <SegmentedControl.Button
          leadingVisual={() => <EyeIcon aria-label="EyeIcon" />}
          leadingIcon={() => <FileCodeIcon aria-label="FileCodeIcon" />}
        >
          Preview
        </SegmentedControl.Button>
      </SegmentedControl>,
    )

    // Should find EyeIcon, not FileCodeIcon
    await expect.element(page.getByRole('img', {name: 'EyeIcon'})).toBeInTheDocument()
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

  it('should include the visual text if the user specifies an aria-label', async () => {
    render(
      <SegmentedControl aria-label="File view" variant={{narrow: 'dropdown'}}>
        {segmentData.map(({label}, index) => (
          <SegmentedControl.Button selected={index === 2} key={label}>
            {label}
          </SegmentedControl.Button>
        ))}
      </SegmentedControl>,
    )

    const menuButton = page.getByLabelText('Blame, File view')
    await expect.element(menuButton).toBeInTheDocument()
  })
})
