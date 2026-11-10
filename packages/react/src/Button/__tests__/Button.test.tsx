import {page, userEvent} from 'vitest/browser'
import {SearchIcon, HeartIcon} from '@primer/octicons-react'
import {render, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import React from 'react'
import {IconButton, Button, LinkButton} from '../../Button'
import classes from '../ButtonBase.module.css'
import {implementsClassName} from '../../utils/testing'
import {FeatureFlags} from '../../FeatureFlags'
import {KeybindingHint} from '../../KeybindingHint'

type StatefulLoadingButtonProps = {
  children?: React.ReactNode
  id?: string
  ['aria-describedby']?: string
  loadingAnnouncement?: string
}

const StatefulLoadingButton = (props: StatefulLoadingButtonProps) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const handleClick = () => {
    setIsLoading(true)
  }

  return <Button loading={isLoading} onClick={handleClick} {...props} />
}

describe('IconButton', () => {
  implementsClassName(IconButton, classes.IconButton)

  it.each([false, true])('renders an icon element with disabled=%s', async disabled => {
    render(
      <IconButton
        icon={<HeartIcon data-testid="icon" size={24} className="custom-icon" />}
        aria-label="Favorite"
        disabled={disabled}
      />,
    )

    const button = page.getByRole('button', {name: 'Favorite'})
    const icon = page.getByTestId('icon')
    expect(button.element()).toContainElement(icon.element())
    await expect.element(icon).toHaveAttribute('width', '24')
    await expect.element(icon).toHaveClass('custom-icon')
  })

  it('renders a ReactNode icon', async () => {
    render(<IconButton icon="icon" aria-label="Text icon" />)

    await expect.element(page.getByRole('button', {name: 'Text icon'})).toHaveTextContent('icon')
  })

  it('replaces an icon element with a spinner while loading', async () => {
    const {rerender} = render(<IconButton icon={<HeartIcon data-testid="icon" />} aria-label="Favorite" loading />)

    const button = page.getByRole('button', {name: 'Favorite'})
    await expect.element(page.getByTestId('icon')).not.toBeInTheDocument()
    expect(button.element().querySelector('[data-component="Spinner"]')).toBeInTheDocument()
    await expect.element(button).toHaveAttribute('aria-disabled', 'true')

    rerender(<IconButton icon={<HeartIcon data-testid="icon" />} aria-label="Favorite" loading={false} />)

    expect(button.element()).toContainElement(page.getByTestId('icon').element())
    expect(button.element().querySelector('[data-component="Spinner"]')).not.toBeInTheDocument()
    await expect.element(button).not.toHaveAttribute('aria-disabled')
  })
})

describe('LinkButton', () => {
  implementsClassName(LinkButton, classes.ButtonBase)
})

describe('Button', () => {
  implementsClassName(Button, classes.ButtonBase)

  it('renders a <button>', () => {
    render(<Button id="test-button">Default</Button>)
    const button = page.getByRole('button')
    expect(button.element().textContent).toEqual('Default')
  })

  it('preserves "onClick" prop', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Noop</Button>)
    const button = page.getByRole('button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects block prop', () => {
    render(
      <Button block id="test-button">
        Block
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  it('displays a notification indicator on the button boundary', async () => {
    render(<Button notificationIndicator="button">Notifications</Button>)
    await expect.element(page.getByRole('button')).toHaveAttribute('data-notification-indicator', 'button')
  })

  it('displays a notification indicator on the leading visual', async () => {
    render(
      <Button leadingVisual={HeartIcon} notificationIndicator="leadingVisual">
        Favorite
      </Button>,
    )

    await expect.element(page.getByRole('button')).toHaveAttribute('data-notification-indicator', 'leadingVisual')
  })

  it('displays a notification indicator on an icon button icon', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Favorite (new activity)" notificationIndicator="icon" />)

    await expect.element(page.getByRole('button')).toHaveAttribute('data-notification-indicator', 'icon')
  })

  it('warns when a leading visual notification indicator has no leading visual', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<Button notificationIndicator="leadingVisual">Favorite</Button>)

    expect(consoleSpy).toHaveBeenCalledWith(
      'Button: `notificationIndicator="leadingVisual"` requires a `leadingVisual` prop.',
    )
    consoleSpy.mockRestore()
  })

  it('respects the "disabled" prop', () => {
    const onClick = vi.fn()

    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element().hasAttribute('disabled')).toEqual(true)
    fireEvent.click(button.element())
    expect(onClick).toHaveBeenCalledTimes(0)
  })

  it('respects the small size prop', () => {
    render(
      <Button size="small" id="test-button">
        Smol
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  it('respects the large size prop', () => {
    render(
      <Button size="large" id="test-button">
        Smol
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  describe.each([
    {size: 'small', padding: '8px', leadingPadding: '6px', height: '28px', lineHeight: '18px'},
    {size: 'medium', padding: '12px', leadingPadding: '8px', height: '32px', lineHeight: '20px'},
    {size: 'large', padding: '16px', leadingPadding: '12px', height: '40px', lineHeight: '20px'},
  ] as const)('$size visual spacing', ({size, padding, leadingPadding, height, lineHeight}) => {
    it.each(['default', 'primary', 'danger', 'invisible', 'link'] as const)(
      'uses semibold text and an 8px radius for the %s variant',
      async variant => {
        render(
          <Button size={size} variant={variant}>
            Label
          </Button>,
        )
        const button = page.getByRole('button', {name: 'Label', exact: true})
        const label = page.getByText('Label', {exact: true})
        await expect.poll(() => getComputedStyle(button.element()).fontWeight).toBe('600')
        await expect.poll(() => getComputedStyle(label.element()).fontWeight).toBe('600')
        expect(getComputedStyle(button.element()).borderRadius).toBe('8px')
      },
    )

    it('does not apply the label weight to shortcut keycaps', async () => {
      render(
        <Button size={size} trailingVisual={<KeybindingHint keys="Mod+Enter" />}>
          Save
        </Button>,
      )
      const button = page.getByRole('button', {name: /^Save/})
      await expect
        .poll(() => getComputedStyle(button.element().querySelector('[data-component="text"]')!).fontWeight)
        .toBe('600')
      expect(getComputedStyle(button.element().querySelector('[data-kbd-chord]')!).fontWeight).toBe('400')
    })

    it.each([
      {leading: false, trailing: false},
      {leading: true, trailing: false},
      {leading: false, trailing: true},
      {leading: true, trailing: true},
    ])('spaces buttons with leading=$leading and trailing=$trailing', async ({leading, trailing}) => {
      render(
        <Button
          size={size}
          leadingVisual={leading ? SearchIcon : undefined}
          trailingVisual={trailing ? HeartIcon : undefined}
        >
          Search
        </Button>,
      )

      const button = page.getByRole('button', {name: 'Search', exact: true})
      await expect
        .poll(() => getComputedStyle(button.element()).paddingInlineStart)
        .toBe(leading ? leadingPadding : padding)
      expect(getComputedStyle(button.element()).paddingInlineEnd).toBe(padding)
      expect(getComputedStyle(button.element()).height).toBe(height)
      expect(getComputedStyle(page.getByText('Search', {exact: true}).element()).lineHeight).toBe(lineHeight)

      const label = page.getByText('Search', {exact: true}).element().getBoundingClientRect()
      const icons = button.element().querySelectorAll('svg')
      if (leading) {
        expect(label.left - icons[0].getBoundingClientRect().right).toBe(6)
      }
      if (trailing) {
        expect(icons[icons.length - 1].getBoundingClientRect().left - label.right).toBe(6)
      }
    })

    it('preserves inline Link height while applying leading visual padding', async () => {
      render(
        <div style={{fontSize: 16}}>
          <Button size={size} variant="link" leadingVisual={SearchIcon}>
            Search
          </Button>
        </div>,
      )
      const button = page.getByRole('button', {name: 'Search', exact: true})
      await expect.poll(() => getComputedStyle(button.element()).paddingInlineStart).toBe(leadingPadding)
      expect(getComputedStyle(button.element()).paddingInlineEnd).toBe(padding)
      expect(button.element().getBoundingClientRect().height).toBeLessThan(Number.parseFloat(height))
      const labelStyle = getComputedStyle(page.getByText('Search', {exact: true}).element())
      expect(labelStyle.fontSize).toBe('16px')
      expect(labelStyle.lineHeight).toBe(size === 'small' ? '26px' : '24px')
    })
  })

  it.each(['small', 'medium', 'large'] as const)('does not change %s IconButton styles', async size => {
    render(<IconButton icon={SearchIcon} aria-label="Search" size={size} />)

    const button = page.getByRole('button', {name: 'Search', exact: true})
    await expect.poll(() => getComputedStyle(button.element()).fontWeight).toBe('500')
    expect(getComputedStyle(button.element()).borderRadius).toBe('6px')
  })

  it.each([
    {size: 'small', padding: '4px'},
    {size: 'medium', padding: '8px'},
    {size: 'large', padding: '12px'},
  ] as const)('preserves $size icon-only counter padding', async ({size, padding}) => {
    render(<Button size={size} leadingVisual={HeartIcon} count={4} aria-label="Favorites" />)
    const button = page.getByRole('button', {name: 'Favorites', exact: true})
    await expect.poll(() => getComputedStyle(button.element()).paddingInlineStart).toBe(padding)
    expect(getComputedStyle(button.element()).paddingInlineEnd).toBe(padding)
  })

  it.each([
    {size: 'small', start: '8px', end: '6px'},
    {size: 'medium', start: '10px', end: '8px'},
    {size: 'large', start: '12px', end: '10px'},
  ] as const)('pads $size shortcut buttons consistently for default and Link variants', async ({size, start, end}) => {
    const {rerender} = render(
      <Button size={size} trailingVisual={<KeybindingHint keys="Mod+Enter" />}>
        Save
      </Button>,
    )
    const button = page.getByRole('button', {name: /^Save/})
    await expect.poll(() => getComputedStyle(button.element()).paddingInlineStart).toBe(start)
    expect(getComputedStyle(button.element()).paddingInlineEnd).toBe(end)
    rerender(
      <Button size={size} variant="link" trailingVisual={<KeybindingHint keys="Mod+Enter" />}>
        Save
      </Button>,
    )
    await expect.poll(() => getComputedStyle(button.element()).paddingInlineStart).toBe(start)
    expect(getComputedStyle(button.element()).paddingInlineEnd).toBe(end)
  })

  it('styles primary button appropriately', () => {
    render(
      <Button variant="primary" id="test-button">
        Primary
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  it('styles invisible button appropriately', () => {
    render(
      <Button variant="invisible" id="test-button">
        Invisible
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  it('styles danger button appropriately', () => {
    render(
      <Button variant="danger" id="test-button">
        Danger
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  it('makes sure icon button has an aria-label', async () => {
    render(<IconButton icon={SearchIcon} aria-label="Search button" />)
    const IconOnlyButton = page.getByLabelText('Search button', {
      exact: true,
    })
    await expect.element(IconOnlyButton).toBeInTheDocument()
  })

  it('respects the alignContent prop', () => {
    render(
      <Button alignContent="start" id="test-button">
        Align start
      </Button>,
    )

    const button = page.getByRole('button')
    expect(button.element()).toMatchSnapshot()
  })

  it('should render the leadingVisual prop before the button content', async () => {
    render(
      <Button leadingVisual={() => <span data-testid="leadingVisual" />}>
        <span>content</span>
      </Button>,
    )

    await expect.element(page.getByTestId('leadingVisual')).toBeInTheDocument()

    const position = page
      .getByText('content', {
        exact: true,
      })
      .element()
      .compareDocumentPosition(page.getByTestId('leadingVisual').element())
    expect(position).toBe(Node.DOCUMENT_POSITION_PRECEDING)
  })

  it('should render the trailingVisual prop after the button content', async () => {
    render(
      <Button trailingVisual={() => <span data-testid="trailingVisual" />}>
        <span>content</span>
      </Button>,
    )
    await expect.element(page.getByTestId('trailingVisual')).toBeInTheDocument()

    const position = page
      .getByText('content', {
        exact: true,
      })
      .element()
      .compareDocumentPosition(page.getByTestId('trailingVisual').element())
    expect(position).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('should describe the button with a default loading announcement, and only when the button is in a loading state', async () => {
    const buttonId = 'loading-button'

    render(
      <StatefulLoadingButton id={buttonId}>
        <span>content</span>
      </StatefulLoadingButton>,
    )

    const buttonNode = page.getByRole('button')

    await userEvent.click(buttonNode)

    await expect.element(buttonNode).toHaveAttribute('aria-describedby', `${buttonId}-loading-announcement`)

    fireEvent.click(buttonNode.element())

    await expect.poll(() => document.getElementById(`${buttonId}-loading-announcement`)?.textContent).toBe('Loading')
  })

  it('should render a custom loading announcement, and only when the button is in a loading state', async () => {
    const buttonId = 'loading-button'

    render(
      <StatefulLoadingButton id={buttonId} loadingAnnouncement="Action loading">
        <span>content</span>
      </StatefulLoadingButton>,
    )

    const buttonNode = page.getByRole('button')

    await userEvent.click(buttonNode)

    await expect.element(buttonNode).toHaveAttribute('aria-describedby', `${buttonId}-loading-announcement`)

    fireEvent.click(buttonNode.element())

    await expect
      .poll(() => document.getElementById(`${buttonId}-loading-announcement`)?.textContent)
      .toBe('Action loading')
  })

  it('should be described by loading announcement AND whatever is passed to aria-describedby', async () => {
    const buttonDescriptionId = 'button-description'
    const buttonId = 'loading-button'

    render(
      <StatefulLoadingButton id={buttonId} aria-describedby={buttonDescriptionId}>
        <span>content</span>
      </StatefulLoadingButton>,
    )

    const buttonNode = page.getByRole('button')

    await userEvent.click(buttonNode)

    const buttonDescribedBy = page.getByRole('button').element().getAttribute('aria-describedby')
    const loadingAnnouncementId = `${buttonId}-loading-announcement`

    expect(buttonDescribedBy).toContain(loadingAnnouncementId)

    expect(buttonDescribedBy).toContain(buttonDescriptionId)
  })

  it('should only set aria-disabled to "true" when the button is in a loading state', async () => {
    render(
      <StatefulLoadingButton>
        <span>content</span>
      </StatefulLoadingButton>,
    )

    const buttonNode = page.getByRole('button')

    expect(buttonNode.element().getAttribute('aria-disabled')).not.toBe('true')

    await userEvent.click(buttonNode)

    await expect.element(buttonNode).toHaveAttribute('aria-disabled', 'true')
  })

  it('allows the consumer to override `aria-disabled`', async () => {
    render(<Button aria-disabled>content</Button>)

    await expect.element(page.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  describe('accessible loading disabled styles', () => {
    const visualStyles = (element: Element) => {
      const {backgroundColor, borderColor, color, cursor} = getComputedStyle(element)
      return {backgroundColor, borderColor, color, cursor}
    }

    const renderWithLoadingDisabledStyles = (children: React.ReactNode) =>
      render(<FeatureFlags flags={{primer_react_button_loading_disabled_styles: true}}>{children}</FeatureFlags>)

    it('applies disabled styles to a loading primary button without using native disabled', async () => {
      renderWithLoadingDisabledStyles(
        <>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary">Enabled</Button>
        </>,
      )

      const loadingButton = page.getByRole('button', {
        name: 'Loading',
        exact: true,
      })
      const disabledButton = page.getByRole('button', {
        name: 'Disabled',
        exact: true,
      })
      const enabledButton = page.getByRole('button', {
        name: 'Enabled',
        exact: true,
      })

      await expect.element(loadingButton).toHaveAttribute('aria-disabled', 'true')
      await expect.element(loadingButton).toHaveAttribute('data-loading', 'true')
      await expect.element(loadingButton).toHaveAttribute('data-loading-disabled-styles', 'true')
      await expect.element(loadingButton).not.toBeDisabled()
      expect(visualStyles(loadingButton.element())).toEqual(visualStyles(disabledButton.element()))
      expect(visualStyles(loadingButton.element()).backgroundColor).not.toBe(
        visualStyles(enabledButton.element()).backgroundColor,
      )
      expect(visualStyles(loadingButton.element()).cursor).toBe('not-allowed')
    })

    it('applies disabled styles when loading is combined with aria-disabled', async () => {
      renderWithLoadingDisabledStyles(
        <>
          <Button variant="primary" loading aria-disabled>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </>,
      )

      const loadingButton = page.getByRole('button', {
        name: 'Loading',
        exact: true,
      })
      const disabledButton = page.getByRole('button', {
        name: 'Disabled',
        exact: true,
      })

      await expect.element(loadingButton).toHaveAttribute('aria-disabled', 'true')
      await expect.element(loadingButton).not.toBeDisabled()
      expect(visualStyles(loadingButton.element())).toEqual(visualStyles(disabledButton.element()))
    })

    it('preserves existing loading styles when the feature flag is disabled', async () => {
      render(
        <>
          <Button variant="primary" loading>
            Loading
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </>,
      )

      const loadingButton = page.getByRole('button', {
        name: 'Loading',
        exact: true,
      })
      const disabledButton = page.getByRole('button', {
        name: 'Disabled',
        exact: true,
      })

      await expect.element(loadingButton).not.toHaveAttribute('data-loading-disabled-styles')
      expect(visualStyles(loadingButton.element())).not.toEqual(visualStyles(disabledButton.element()))
    })

    it('does not call onClick while loading', () => {
      const onClick = vi.fn()
      render(
        <Button variant="primary" loading onClick={onClick}>
          Submit
        </Button>,
      )

      fireEvent.click(
        page
          .getByRole('button', {
            name: 'Submit',
            exact: true,
          })
          .element(),
      )
      expect(onClick).not.toHaveBeenCalled()
    })

    it('remains focusable while loading', async () => {
      render(
        <Button variant="primary" loading>
          Submit
        </Button>,
      )

      const button = page.getByRole('button', {
        name: 'Submit',
        exact: true,
      })
      button.element().focus()
      expect(button.element()).toHaveFocus()
    })

    it('still applies disabled styles for aria-disabled without loading', () => {
      render(
        <>
          <Button variant="primary" aria-disabled>
            Aria disabled
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </>,
      )

      expect(
        visualStyles(
          page
            .getByRole('button', {
              name: 'Aria disabled',
              exact: true,
            })
            .element(),
        ),
      ).toEqual(
        visualStyles(
          page
            .getByRole('button', {
              name: 'Disabled',
              exact: true,
            })
            .element(),
        ),
      )
    })

    it('does not let inactive override primary the same way disabled styles do', () => {
      render(
        <>
          <Button variant="primary" inactive>
            Inactive
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </>,
      )

      expect(
        visualStyles(
          page
            .getByRole('button', {
              name: 'Inactive',
              exact: true,
            })
            .element(),
        ),
      ).not.toEqual(
        visualStyles(
          page
            .getByRole('button', {
              name: 'Disabled',
              exact: true,
            })
            .element(),
        ),
      )
    })
  })

  it('should preserve the accessible button name when the button is in a loading state', async () => {
    render(<Button loading>content</Button>)

    await expect.element(page.getByRole('button')).toHaveAccessibleName('content')
  })

  it('should apply inline-flex display to loading wrapper when variant is link', async () => {
    const {container} = render(
      <Button variant="link" loading>
        content
      </Button>,
    )

    const wrapper = container.querySelector<HTMLElement>('[data-loading-wrapper]')
    await expect.element(wrapper).toBeInTheDocument()
    await expect.element(wrapper).toHaveClass(classes.ConditionalWrapperLink)
  })

  it('should render tooltip on an icon button when unsafeDisableTooltip prop is passed as false', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" />)
    const triggerEL = page.getByRole('button')
    const tooltipEl = page.getByText('Heart', {
      exact: true,
    })
    await expect.element(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.element().id)
  })
  it('should render description type tooltip on an icon button when unsafeDisableTooltip prop is passed as false', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" />)

    const triggerEL = page.getByRole('button')
    await expect.element(triggerEL).toHaveAttribute('aria-label', 'Heart')
    const tooltipEl = page.getByText('Love is all around', {
      exact: true,
    })
    expect(triggerEL.element().getAttribute('aria-describedby')).toContain(tooltipEl.element().id)
  })
  it('should render tooltip on an icon button by default', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" />)
    const triggerEl = page.getByRole('button')
    const tooltipEl = page.getByText('Heart', {
      exact: true,
    })
    await expect.element(triggerEl).toHaveAttribute('aria-labelledby', tooltipEl.element().id)
    await expect.element(triggerEl).not.toHaveAttribute('aria-label')
  })
  it('should render aria-keyshorts on an icon button when keyshortcuts prop is passed', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" keyshortcuts="Command+H" />)
    const triggerEl = page.getByRole('button')
    await expect.element(triggerEl).toHaveAttribute('aria-keyshortcuts', 'Command+H')
  })
  it('should append the keyshortcuts to the tooltip text that labels the icon button when keyshortcuts prop is passed', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" keyshortcuts="Command+H" />)
    const triggerEl = page.getByRole('button', {
      name: 'Heart (command h)',
      exact: true,
    })
    await expect.element(triggerEl).toBeInTheDocument()
  })
  it('should render aria-keyshortcuts on an icon button when keyshortcuts prop is passed (Description Type)', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" keyshortcuts="Command+H" />)

    const triggerEl = page.getByRole('button')
    await expect.element(triggerEl).toHaveAttribute('aria-keyshortcuts', 'Command+H')
  })
  it('should append the keyshortcuts to the tooltip text that describes the icon button when keyshortcuts prop is passed (Description Type)', async () => {
    render(<IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" keyshortcuts="Command+H" />)

    const triggerEl = page.getByRole('button', {
      name: 'Heart',
      exact: true,
    })
    await expect.element(triggerEl).toHaveAccessibleDescription('Love is all around (command h)')
  })
})

describe('data-component attributes', () => {
  describe('Button', () => {
    it('should have data-component="Button" on the button element', async () => {
      const {container} = render(<Button>Click me</Button>)
      await expect.element(container.querySelector<HTMLElement>('[data-component="Button"]')).toBeInTheDocument()
    })

    it('should have data-component="buttonContent" on the content wrapper', async () => {
      const {container} = render(<Button>Click me</Button>)
      await expect.element(container.querySelector<HTMLElement>('[data-component="buttonContent"]')).toBeInTheDocument()
    })

    it('should have data-component="text" on the text element', async () => {
      const {container} = render(<Button>Click me</Button>)
      await expect.element(container.querySelector<HTMLElement>('[data-component="text"]')).toBeInTheDocument()
    })

    it('should have data-component="leadingVisual" on leading visual', async () => {
      const {container} = render(<Button leadingVisual={SearchIcon}>Search</Button>)
      await expect.element(container.querySelector<HTMLElement>('[data-component="leadingVisual"]')).toBeInTheDocument()
    })

    it('should have data-component="trailingVisual" on trailing visual', async () => {
      const {container} = render(<Button trailingVisual={HeartIcon}>Like</Button>)
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="trailingVisual"]'))
        .toBeInTheDocument()
    })

    it('should have data-component="ButtonCounter" on count element', async () => {
      const {container} = render(<Button count={5}>Notifications</Button>)
      await expect.element(container.querySelector<HTMLElement>('[data-component="ButtonCounter"]')).toBeInTheDocument()
    })

    it('should have data-component="loadingSpinner" when loading without visuals', async () => {
      const {container} = render(<Button loading>Loading</Button>)
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="loadingSpinner"]'))
        .toBeInTheDocument()
    })
  })

  describe('data-icon-only-counter', () => {
    it('is set when count, leadingVisual, and no children are present', async () => {
      const {container} = render(<Button leadingVisual={SearchIcon} count={5} aria-label="Search notifications" />)
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="Button"]'))
        .toHaveAttribute('data-icon-only-counter', 'true')
    })

    it('is not set when children are present', async () => {
      const {container} = render(
        <Button leadingVisual={SearchIcon} count={5}>
          Search
        </Button>,
      )
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="Button"]'))
        .not.toHaveAttribute('data-icon-only-counter')
    })

    it('is not set when leadingVisual is missing', async () => {
      const {container} = render(<Button count={5} aria-label="Notifications" />)
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="Button"]'))
        .not.toHaveAttribute('data-icon-only-counter')
    })

    it('is not set when count is missing', async () => {
      const {container} = render(<Button leadingVisual={SearchIcon} aria-label="Search" />)
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="Button"]'))
        .not.toHaveAttribute('data-icon-only-counter')
    })
  })

  describe('IconButton', () => {
    it('should have data-component="IconButton" on the button element', async () => {
      const {container} = render(<IconButton icon={SearchIcon} aria-label="Search" />)
      await expect.element(container.querySelector<HTMLElement>('[data-component="IconButton"]')).toBeInTheDocument()
    })
  })

  describe('LinkButton', () => {
    it('should have data-component="LinkButton" on the link element', async () => {
      const {container} = render(<LinkButton href="#">Link</LinkButton>)
      await expect.element(container.querySelector<HTMLElement>('[data-component="LinkButton"]')).toBeInTheDocument()
    })

    it('should have data-component="buttonContent" on the content wrapper', async () => {
      const {container} = render(<LinkButton href="#">Link</LinkButton>)
      await expect
        .element(container.querySelector<HTMLElement>('[data-component="LinkButton"] [data-component="buttonContent"]'))
        .toBeInTheDocument()
    })
  })
})
