import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {createRef} from 'react'
import {Banner} from '../Banner'
import {implementsClassName} from '../utils/testing'
import classes from './Banner.module.css'

describe('Banner', () => {
  implementsClassName(props => <Banner title="test" {...props} />, classes.Banner)

  /**
   * @see ./SPEC.md#default
   */
  it('should render as a region element', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('region', {name: 'test'})).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('heading', {name: 'test'})).toBeInTheDocument()
  })

  it('renders data-component attributes', () => {
    const {container} = render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction>test primary action</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>test secondary action</Banner.SecondaryAction>}
        onDismiss={() => {}}
      />,
    )

    expect(container.querySelector('[data-component="Banner"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Banner.Icon"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Banner.Content"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Banner.Actions"]')).toBeInTheDocument()

    expect(container.querySelector('[data-component="Banner.PrimaryAction"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Banner.SecondaryAction"]')).toBeInTheDocument()

    expect(container.querySelector('[data-component="Banner.Title"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Banner.Description"]')).toBeInTheDocument()
  })

  it('renders Banner dismiss IconButton with data-component attribute', () => {
    const {container} = render(<Banner title="test" onDismiss={() => {}} />)

    const dismissButton = container.querySelector('[data-component="Banner"] [data-component="IconButton"]')
    expect(dismissButton).toBeInTheDocument()
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should label the landmark element with the title by default', () => {
    render(<Banner title="My Banner Title" />)
    const region = screen.getByRole('region', {name: 'My Banner Title'})
    expect(region).toHaveAttribute('aria-labelledby')
    expect(region).not.toHaveAttribute('aria-label')
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should use aria-labelledby to reference the title for the critical variant', () => {
    render(<Banner title="Critical Issue" variant="critical" />)
    const region = screen.getByRole('region', {name: 'Critical Issue'})
    expect(region).toHaveAttribute('aria-labelledby')
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should use aria-labelledby to reference the title for the info variant', () => {
    render(<Banner title="Information" variant="info" />)
    const region = screen.getByRole('region', {name: 'Information'})
    expect(region).toHaveAttribute('aria-labelledby')
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should use aria-labelledby to reference the title for the success variant', () => {
    render(<Banner title="Success Message" variant="success" />)
    const region = screen.getByRole('region', {name: 'Success Message'})
    expect(region).toHaveAttribute('aria-labelledby')
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should use aria-labelledby to reference the title for the upsell variant', () => {
    render(<Banner title="Recommendation" variant="upsell" />)
    const region = screen.getByRole('region', {name: 'Recommendation'})
    expect(region).toHaveAttribute('aria-labelledby')
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should use aria-labelledby to reference the title for the warning variant', () => {
    render(<Banner title="Warning" variant="warning" />)
    const region = screen.getByRole('region', {name: 'Warning'})
    expect(region).toHaveAttribute('aria-labelledby')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should support the `aria-label` prop to override the default label for the landmark', () => {
    render(<Banner aria-label="Test" title="test" variant="warning" />)
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Test')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should prefer aria-labelledby over aria-label and not set both', () => {
    render(
      <Banner aria-label="Override" aria-labelledby="my-banner-title">
        <Banner.Title id="my-banner-title">Explicit Banner Title</Banner.Title>
      </Banner>,
    )

    const region = screen.getByRole('region', {name: 'Explicit Banner Title'})
    expect(region).toHaveAttribute('aria-labelledby', 'my-banner-title')
    expect(region).not.toHaveAttribute('aria-label')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should only set aria-label when aria-labelledby is not provided', () => {
    render(<Banner aria-label="Custom Label" title="test" />)
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-label', 'Custom Label')
    expect(region).not.toHaveAttribute('aria-labelledby')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should use aria-labelledby to reference Banner.Title when provided as a child', () => {
    render(
      <Banner>
        <Banner.Title>Custom Title Component</Banner.Title>
      </Banner>,
    )
    const region = screen.getByRole('region', {name: 'Custom Title Component'})
    const heading = screen.getByRole('heading', {name: 'Custom Title Component'})
    expect(region).toHaveAttribute('aria-labelledby', heading.id)
    expect(heading).toHaveAttribute('id')
    expect(region).not.toHaveAttribute('aria-label')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should use aria-labelledby to reference Banner.Title with custom id', () => {
    render(
      <Banner aria-labelledby="custom-title-id">
        <Banner.Title id="custom-title-id">Title with Custom ID</Banner.Title>
      </Banner>,
    )
    const region = screen.getByRole('region', {name: 'Title with Custom ID'})
    expect(region).toHaveAttribute('aria-labelledby', 'custom-title-id')
    expect(screen.getByRole('heading')).toHaveAttribute('id', 'custom-title-id')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should default the title to a h2', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument()
    expect(screen.getByRole('heading', {level: 2})).toEqual(screen.getByText('test'))
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should keep a visually hidden title in the accessibility tree', () => {
    render(<Banner title="Hidden title" hideTitle />)

    expect(screen.getByRole('region', {name: 'Hidden title'})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'Hidden title'})).toBeInTheDocument()
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should throw an error if no title is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<Banner />)
    }).toThrowErrorMatchingSnapshot()
    spy.mockRestore()
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should throw an error if more than one title is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(
        <Banner title="Title prop">
          <Banner.Title>Title child</Banner.Title>
        </Banner>,
      )
    }).toThrow(
      'Expected exactly one title to be provided to the <Banner> component with either the `title` prop or through `<Banner.Title>` but multiple titles were found',
    )
    spy.mockRestore()
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should not automatically announce itself', () => {
    render(<Banner title="test" />)
    const banner = screen.getByRole('region', {name: 'test'})

    expect(banner).not.toHaveAttribute('aria-live')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should rendering a description with the `description` prop', () => {
    render(<Banner title="test" description="test-description" />)
    expect(screen.getByText('test-description')).toBeInTheDocument()
    expect(screen.getByRole('region', {name: 'test'})).toContainElement(screen.getByText('test-description'))
  })

  /**
   * @see ./SPEC.md#actions
   */
  it('should support a primary action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction onClick={onClick}>test primary action</Banner.PrimaryAction>}
      />,
    )

    expect(screen.queryAllByRole('button', {name: 'test primary action', hidden: true}).length).toBe(2)
    expect(screen.getAllByRole('button', {name: 'test primary action'})).toHaveLength(1)

    await user.click(screen.queryAllByText('test primary action')[0])
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  /**
   * @see ./SPEC.md#actions
   */
  it('should support a secondary action', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Banner
        title="test"
        description="test-description"
        secondaryAction={<Banner.SecondaryAction onClick={onClick}>test secondary action</Banner.SecondaryAction>}
      />,
    )

    expect(screen.queryAllByRole('button', {name: 'test secondary action', hidden: true}).length).toBe(2)
    expect(screen.getAllByRole('button', {name: 'test secondary action'})).toHaveLength(1)

    await user.click(screen.queryAllByText('test secondary action')[0])
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  /**
   * @see ./SPEC.md#actions
   */
  it('should support primary action and secondary action', () => {
    render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction>test primary action</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>test secondary action</Banner.SecondaryAction>}
      />,
    )

    expect(screen.queryAllByRole('button', {name: 'test primary action', hidden: true}).length).toBe(2)
    expect(screen.queryAllByRole('button', {name: 'test secondary action', hidden: true}).length).toBe(2)
    expect(screen.getAllByRole('button', {name: 'test primary action'})).toHaveLength(1)
    expect(screen.getAllByRole('button', {name: 'test secondary action'})).toHaveLength(1)
  })

  /**
   * @see ./SPEC.md#actions
   */
  it.each(['default', 'inline', 'stacked'] as const)(
    'should expose one operable instance of each action in the %s layout',
    actionsLayout => {
      render(
        <Banner
          title="test"
          actionsLayout={actionsLayout}
          primaryAction={<Banner.PrimaryAction>test primary action</Banner.PrimaryAction>}
          secondaryAction={<Banner.SecondaryAction>test secondary action</Banner.SecondaryAction>}
        />,
      )

      expect(screen.getAllByRole('button', {name: 'test primary action'})).toHaveLength(1)
      expect(screen.getAllByRole('button', {name: 'test secondary action'})).toHaveLength(1)
    },
  )

  /**
   * @see ./SPEC.md#actions
   */
  it('should support rendering actions as links', () => {
    render(
      <Banner
        title="test"
        primaryAction={
          <Banner.PrimaryAction as="a" href="#primary">
            test primary action
          </Banner.PrimaryAction>
        }
        secondaryAction={
          <Banner.SecondaryAction as="a" href="#secondary">
            test secondary action
          </Banner.SecondaryAction>
        }
      />,
    )

    expect(screen.getAllByRole('link', {name: 'test primary action'})).toHaveLength(1)
    expect(screen.getAllByRole('link', {name: 'test secondary action'})).toHaveLength(1)
  })

  /**
   * @see ./SPEC.md#actions
   */
  it('should not dismiss the Banner when an action is activated', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()
    const onDismiss = vi.fn()
    render(
      <Banner
        title="test"
        onDismiss={onDismiss}
        primaryAction={<Banner.PrimaryAction onClick={onAction}>test primary action</Banner.PrimaryAction>}
      />,
    )

    await user.click(screen.getByRole('button', {name: 'test primary action'}))

    expect(onAction).toHaveBeenCalledOnce()
    expect(onDismiss).not.toHaveBeenCalled()
  })

  /**
   * @see ./SPEC.md#dismissal
   */
  it('should call `onDismiss` when the dismiss button is activated', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Banner title="test" description="test-description" onDismiss={onDismiss} />)

    await user.click(screen.getByRole('button', {name: 'Dismiss banner'}))
    expect(onDismiss).toHaveBeenCalledTimes(1)

    expect(screen.getByRole('button', {name: 'Dismiss banner'})).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onDismiss).toHaveBeenCalledTimes(2)

    await user.type(screen.getByRole('button', {name: 'Dismiss banner'}), '{Space}')
    expect(onDismiss).toHaveBeenCalledTimes(3)
  })

  /**
   * @see ./SPEC.md#dismissal
   */
  it.each(['critical', 'info', 'success', 'upsell', 'warning'] as const)(
    'should support onDismiss for the %s variant',
    variant => {
      const onDismiss = vi.fn()
      render(<Banner title="test" description="test-description" onDismiss={onDismiss} variant={variant} />)
      expect(screen.queryByRole('button', {name: 'Dismiss banner'})).toBeInTheDocument()
    },
  )

  /**
   * @see ./SPEC.md#default
   */
  it('should pass extra props onto the container element', () => {
    const {container} = render(<Banner title="test" data-testid="test" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
  })

  /**
   * @see ./SPEC.md#default
   */
  it('should forward the ref to the root section', () => {
    const ref = createRef<HTMLElement>()
    render(<Banner ref={ref} title="test" />)

    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('SECTION')
    expect(ref.current).toHaveAttribute('data-component', 'Banner')
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it.each(['critical', 'info', 'success', 'upsell', 'warning'] as const)(
    'should render a decorative built-in leading visual for the %s variant',
    variant => {
      const {container} = render(<Banner title={variant} variant={variant} />)
      const visual = container.querySelector('[data-component="Banner.Icon"] svg')

      expect(visual).toBeInTheDocument()
      expect(visual).toHaveAttribute('aria-hidden', 'true')
    },
  )

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should support a custom icon for info and upsell variants', () => {
    const CustomIcon = vi.fn(() => <svg data-testid="icon" aria-hidden="true" />)
    const {rerender} = render(
      <Banner title="test" description="test-description" variant="info" icon={<CustomIcon />} />,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="upsell" icon={<CustomIcon />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="critical" icon={<CustomIcon />} />)
    expect(screen.queryByTestId('icon')).toBe(null)

    rerender(<Banner title="test" description="test-description" variant="success" icon={<CustomIcon />} />)
    expect(screen.queryByTestId('icon')).toBe(null)

    rerender(<Banner title="test" description="test-description" variant="warning" icon={<CustomIcon />} />)
    expect(screen.queryByTestId('icon')).toBe(null)
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should support a custom leadingVisual for info and upsell variants', () => {
    const CustomIcon = vi.fn(() => <svg data-testid="leading-visual" aria-hidden="true" />)
    const {rerender} = render(
      <Banner title="test" description="test-description" variant="info" leadingVisual={<CustomIcon />} />,
    )
    expect(screen.getByTestId('leading-visual')).toBeInTheDocument()
    expect(screen.getByTestId('leading-visual')).toHaveAttribute('aria-hidden', 'true')

    rerender(<Banner title="test" description="test-description" variant="upsell" leadingVisual={<CustomIcon />} />)
    expect(screen.getByTestId('leading-visual')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="critical" leadingVisual={<CustomIcon />} />)
    expect(screen.queryByTestId('leading-visual')).toBe(null)

    rerender(<Banner title="test" description="test-description" variant="success" leadingVisual={<CustomIcon />} />)
    expect(screen.queryByTestId('leading-visual')).toBe(null)

    rerender(<Banner title="test" description="test-description" variant="warning" leadingVisual={<CustomIcon />} />)
    expect(screen.queryByTestId('leading-visual')).toBe(null)
  })

  /**
   * @see ./SPEC.md#variants-and-leading-visuals
   */
  it('should prefer leadingVisual over icon when both are provided', () => {
    const LeadingVisualIcon = () => <svg data-testid="leading-visual" aria-hidden="true" />
    const DeprecatedIcon = () => <svg data-testid="deprecated-icon" aria-hidden="true" />
    render(
      <Banner
        title="test"
        description="test-description"
        variant="info"
        leadingVisual={<LeadingVisualIcon />}
        icon={<DeprecatedIcon />}
      />,
    )
    expect(screen.getByTestId('leading-visual')).toBeInTheDocument()
    expect(screen.queryByTestId('deprecated-icon')).toBe(null)
  })

  /**
   * @see ./SPEC.md#layout
   */
  it('should render data-actions-layout attribute with inline value', () => {
    const {container} = render(<Banner title="test" actionsLayout="inline" />)
    expect(container.firstChild).toHaveAttribute('data-actions-layout', 'inline')
  })

  /**
   * @see ./SPEC.md#layout
   */
  it('should render data-actions-layout attribute with stacked value', () => {
    const {container} = render(<Banner title="test" actionsLayout="stacked" />)
    expect(container.firstChild).toHaveAttribute('data-actions-layout', 'stacked')
  })

  /**
   * @see ./SPEC.md#layout
   */
  it('should render data-actions-layout attribute with default value when not specified', () => {
    const {container} = render(<Banner title="test" />)
    expect(container.firstChild).toHaveAttribute('data-actions-layout', 'default')
  })

  /**
   * @see ./SPEC.md#layout
   */
  it('should render data-flush attribute when flush is true', () => {
    const {container} = render(<Banner title="test" flush />)
    expect(container.firstChild).toHaveAttribute('data-flush')
  })

  /**
   * @see ./SPEC.md#layout
   */
  it('should not render data-flush attribute when flush is false', () => {
    const {container} = render(<Banner title="test" />)
    expect(container.firstChild).not.toHaveAttribute('data-flush')
  })

  /**
   * @see ./SPEC.md#layout
   */
  it('should render the compact layout', () => {
    const {container} = render(<Banner title="test" layout="compact" />)
    expect(container.firstChild).toHaveAttribute('data-layout', 'compact')
  })

  describe('Banner.Title', () => {
    /**
     * @see ./SPEC.md#default
     */
    it('should render as a h2 element by default', () => {
      render(
        <Banner>
          <Banner.Title>test</Banner.Title>
        </Banner>,
      )
      expect(screen.getByRole('heading', {level: 2, name: 'test'})).toBeInTheDocument()
    })

    /**
     * @see ./SPEC.md#default
     */
    it('should support rendering as any heading element above level 2', () => {
      const levels = [2, 3, 4, 5, 6] as const

      render(
        <>
          <Banner>
            <Banner.Title as="h2">test level 2</Banner.Title>
          </Banner>
          <Banner>
            <Banner.Title as="h3">test level 3</Banner.Title>
          </Banner>
          <Banner>
            <Banner.Title as="h4">test level 4</Banner.Title>
          </Banner>
          <Banner>
            <Banner.Title as="h5">test level 5</Banner.Title>
          </Banner>
          <Banner>
            <Banner.Title as="h6">test level 6</Banner.Title>
          </Banner>
        </>,
      )

      for (const level of levels) {
        expect(screen.getByRole('heading', {level, name: `test level ${level}`})).toBeInTheDocument()
      }
    })

    it('should support a custom `className` on the container element', () => {
      render(
        <Banner>
          <Banner.Title className="custom-class">test</Banner.Title>
        </Banner>,
      )
      expect(screen.getByRole('heading', {name: 'test'})).toHaveClass('custom-class')
    })

    it('should pass extra props onto the container element', () => {
      render(
        <Banner>
          <Banner.Title data-testid="test">test</Banner.Title>
        </Banner>,
      )
      expect(screen.getByRole('heading', {name: 'test'})).toHaveAttribute('data-testid', 'test')
    })
  })

  describe('Banner.Description', () => {
    it('should support a custom `className` on the container element', () => {
      render(
        <Banner>
          <Banner.Title>test title</Banner.Title>
          <Banner.Description className="custom-class">test description</Banner.Description>
        </Banner>,
      )
      expect(screen.getByText('test description')).toHaveClass('custom-class')
    })

    it('should pass extra props onto the container element', () => {
      render(
        <Banner>
          <Banner.Title>test title</Banner.Title>
          <Banner.Description data-testid="test">test description</Banner.Description>
        </Banner>,
      )
      expect(screen.getByText('test description')).toHaveAttribute('data-testid', 'test')
    })
  })
})
