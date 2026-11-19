import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
import {page, userEvent} from 'vitest/browser'
import {Banner} from '../Banner'
import {implementsClassName} from '../utils/testing'
import classes from './Banner.module.css'

describe('Banner', () => {
  implementsClassName(props => <Banner title="test" {...props} />, classes.Banner)

  it('should render as a region element', async () => {
    render(<Banner title="test" />)
    await expect.element(page.getByRole('region', {name: 'test'})).toBeInTheDocument()
    await expect.element(page.getByRole('heading', {name: 'test'})).toBeInTheDocument()
  })

  it('renders data-component attributes', async () => {
    const {container} = render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction>test primary action</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>test secondary action</Banner.SecondaryAction>}
        onDismiss={() => {}}
      />,
    )

    await expect.element(container.querySelector<HTMLElement>('[data-component="Banner"]')).toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Banner.Icon"]')).toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Banner.Content"]')).toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Banner.Actions"]')).toBeInTheDocument()

    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner.PrimaryAction"]'))
      .toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner.SecondaryAction"]'))
      .toBeInTheDocument()

    await expect.element(container.querySelector<HTMLElement>('[data-component="Banner.Title"]')).toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner.Description"]'))
      .toBeInTheDocument()
  })

  it('renders Banner dismiss IconButton with data-component attribute', async () => {
    const {container} = render(<Banner title="test" onDismiss={() => {}} />)

    const dismissButton = container.querySelector<HTMLElement>(
      '[data-component="Banner"] [data-component="IconButton"]',
    )
    await expect.element(dismissButton).toBeInTheDocument()
  })

  it('should label the landmark element with the title by default', async () => {
    render(<Banner title="My Banner Title" />)
    const region = page.getByRole('region', {name: 'My Banner Title'})
    await expect.element(region).toHaveAttribute('aria-labelledby')
    await expect.element(region).not.toHaveAttribute('aria-label')
  })

  it('should use aria-labelledby to reference the title for the critical variant', async () => {
    render(<Banner title="Critical Issue" variant="critical" />)
    const region = page.getByRole('region', {name: 'Critical Issue'})
    await expect.element(region).toHaveAttribute('aria-labelledby')
  })

  it('should use aria-labelledby to reference the title for the info variant', async () => {
    render(<Banner title="Information" variant="info" />)
    const region = page.getByRole('region', {name: 'Information'})
    await expect.element(region).toHaveAttribute('aria-labelledby')
  })

  it('should use aria-labelledby to reference the title for the success variant', async () => {
    render(<Banner title="Success Message" variant="success" />)
    const region = page.getByRole('region', {name: 'Success Message'})
    await expect.element(region).toHaveAttribute('aria-labelledby')
  })

  it('should use aria-labelledby to reference the title for the upsell variant', async () => {
    render(<Banner title="Recommendation" variant="upsell" />)
    const region = page.getByRole('region', {name: 'Recommendation'})
    await expect.element(region).toHaveAttribute('aria-labelledby')
  })

  it('should use aria-labelledby to reference the title for the warning variant', async () => {
    render(<Banner title="Warning" variant="warning" />)
    const region = page.getByRole('region', {name: 'Warning'})
    await expect.element(region).toHaveAttribute('aria-labelledby')
  })

  it('should support the `aria-label` prop to override the default label for the landmark', async () => {
    render(<Banner aria-label="Test" title="test" variant="warning" />)
    await expect.element(page.getByRole('region')).toHaveAttribute('aria-label', 'Test')
  })

  it('should prefer aria-labelledby over aria-label and not set both', async () => {
    render(
      <Banner aria-label="Override" aria-labelledby="my-banner-title">
        <Banner.Title id="my-banner-title">Explicit Banner Title</Banner.Title>
      </Banner>,
    )

    const region = page.getByRole('region', {name: 'Explicit Banner Title'})
    await expect.element(region).toHaveAttribute('aria-labelledby', 'my-banner-title')
    await expect.element(region).not.toHaveAttribute('aria-label')
  })

  it('should only set aria-label when aria-labelledby is not provided', async () => {
    render(<Banner aria-label="Custom Label" title="test" />)
    const region = page.getByRole('region')
    await expect.element(region).toHaveAttribute('aria-label', 'Custom Label')
    await expect.element(region).not.toHaveAttribute('aria-labelledby')
  })

  it('should use aria-labelledby to reference Banner.Title when provided as a child', async () => {
    render(
      <Banner>
        <Banner.Title>Custom Title Component</Banner.Title>
      </Banner>,
    )
    const region = page.getByRole('region', {name: 'Custom Title Component'})
    const heading = page.getByRole('heading', {name: 'Custom Title Component'})
    await expect.element(region).toHaveAttribute('aria-labelledby', heading.element().id)
    await expect.element(heading).toHaveAttribute('id')
    await expect.element(region).not.toHaveAttribute('aria-label')
  })

  it('should use aria-labelledby to reference Banner.Title with custom id', async () => {
    render(
      <Banner aria-labelledby="custom-title-id">
        <Banner.Title id="custom-title-id">Title with Custom ID</Banner.Title>
      </Banner>,
    )
    const region = page.getByRole('region', {name: 'Title with Custom ID'})
    await expect.element(region).toHaveAttribute('aria-labelledby', 'custom-title-id')
    await expect.element(page.getByRole('heading')).toHaveAttribute('id', 'custom-title-id')
  })

  it('should default the title to a h2', async () => {
    render(<Banner title="test" />)
    await expect.element(page.getByRole('heading', {level: 2})).toBeInTheDocument()
    expect(page.getByRole('heading', {level: 2}).element()).toEqual(page.getByText('test', {exact: true}).element())
  })

  it('should throw an error if no title is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<Banner />)
    }).toThrowErrorMatchingSnapshot()
    spy.mockRestore()
  })

  it('should rendering a description with the `description` prop', async () => {
    render(<Banner title="test" description="test-description" />)
    await expect.element(page.getByText('test-description')).toBeInTheDocument()
    await expect
      .element(page.getByRole('region', {name: 'test'}))
      .toContainElement(page.getByText('test-description').element())
  })

  it('should support a primary action', async () => {
    const onClick = vi.fn()
    render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction onClick={onClick}>test primary action</Banner.PrimaryAction>}
      />,
    )

    expect(page.getByRole('button', {name: 'test primary action', includeHidden: true}).elements()).toHaveLength(2)

    await userEvent.click(page.getByRole('button', {name: 'test primary action'}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should support a secondary action', async () => {
    const onClick = vi.fn()
    render(
      <Banner
        title="test"
        description="test-description"
        secondaryAction={<Banner.SecondaryAction onClick={onClick}>test secondary action</Banner.SecondaryAction>}
      />,
    )

    expect(page.getByRole('button', {name: 'test secondary action', includeHidden: true}).elements()).toHaveLength(2)

    await userEvent.click(page.getByRole('button', {name: 'test secondary action'}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should support primary action and secondary action', async () => {
    render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction>test primary action</Banner.PrimaryAction>}
        secondaryAction={<Banner.SecondaryAction>test secondary action</Banner.SecondaryAction>}
      />,
    )

    expect(page.getByRole('button', {name: 'test primary action', includeHidden: true}).elements()).toHaveLength(2)
    expect(page.getByRole('button', {name: 'test secondary action', includeHidden: true}).elements()).toHaveLength(2)
  })

  it('should call `onDismiss` when the dismiss button is activated', async () => {
    const onDismiss = vi.fn()
    render(<Banner title="test" description="test-description" onDismiss={onDismiss} />)

    await userEvent.click(page.getByRole('button', {name: 'Dismiss banner'}))
    expect(onDismiss).toHaveBeenCalledTimes(1)

    await expect.element(page.getByRole('button', {name: 'Dismiss banner'})).toHaveFocus()

    await userEvent.keyboard('{Enter}')
    expect(onDismiss).toHaveBeenCalledTimes(2)

    await userEvent.keyboard(' ')
    expect(onDismiss).toHaveBeenCalledTimes(3)
  })

  it.each(['critical', 'info', 'success', 'upsell', 'warning'] as const)(
    'should support onDismiss for the %s variant',
    async variant => {
      const onDismiss = vi.fn()
      render(<Banner title="test" description="test-description" onDismiss={onDismiss} variant={variant} />)
      await expect.element(page.getByRole('button', {name: 'Dismiss banner'})).toBeInTheDocument()
    },
  )

  it('should pass extra props onto the container element', async () => {
    const {container} = render(<Banner title="test" data-testid="test" />)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner"]'))
      .toHaveAttribute('data-testid', 'test')
  })

  it('should support a custom icon for info and upsell variants', async () => {
    const CustomIcon = vi.fn(() => <svg data-testid="icon" aria-hidden="true" />)
    const {rerender} = render(
      <Banner title="test" description="test-description" variant="info" icon={<CustomIcon />} />,
    )
    await expect.element(page.getByTestId('icon')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="upsell" icon={<CustomIcon />} />)
    await expect.element(page.getByTestId('icon')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="critical" icon={<CustomIcon />} />)
    await expect.element(page.getByTestId('icon')).not.toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="success" icon={<CustomIcon />} />)
    await expect.element(page.getByTestId('icon')).not.toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="warning" icon={<CustomIcon />} />)
    await expect.element(page.getByTestId('icon')).not.toBeInTheDocument()
  })

  it('should support a custom leadingVisual for info and upsell variants', async () => {
    const CustomIcon = vi.fn(() => <svg data-testid="leading-visual" aria-hidden="true" />)
    const {rerender} = render(
      <Banner title="test" description="test-description" variant="info" leadingVisual={<CustomIcon />} />,
    )
    await expect.element(page.getByTestId('leading-visual')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="upsell" leadingVisual={<CustomIcon />} />)
    await expect.element(page.getByTestId('leading-visual')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="critical" leadingVisual={<CustomIcon />} />)
    await expect.element(page.getByTestId('leading-visual')).not.toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="success" leadingVisual={<CustomIcon />} />)
    await expect.element(page.getByTestId('leading-visual')).not.toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="warning" leadingVisual={<CustomIcon />} />)
    await expect.element(page.getByTestId('leading-visual')).not.toBeInTheDocument()
  })

  it('should prefer leadingVisual over icon when both are provided', async () => {
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
    await expect.element(page.getByTestId('leading-visual')).toBeInTheDocument()
    await expect.element(page.getByTestId('deprecated-icon')).not.toBeInTheDocument()
  })

  it('should render data-actions-layout attribute with inline value', async () => {
    const {container} = render(<Banner title="test" actionsLayout="inline" />)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner"]'))
      .toHaveAttribute('data-actions-layout', 'inline')
  })

  it('should render data-actions-layout attribute with stacked value', async () => {
    const {container} = render(<Banner title="test" actionsLayout="stacked" />)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner"]'))
      .toHaveAttribute('data-actions-layout', 'stacked')
  })

  it('should render data-actions-layout attribute with default value when not specified', async () => {
    const {container} = render(<Banner title="test" />)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner"]'))
      .toHaveAttribute('data-actions-layout', 'default')
  })

  it('should render data-flush attribute when flush is true', async () => {
    const {container} = render(<Banner title="test" flush />)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner"]'))
      .toHaveAttribute('data-flush')
  })

  it('should not render data-flush attribute when flush is false', async () => {
    const {container} = render(<Banner title="test" />)
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Banner"]'))
      .not.toHaveAttribute('data-flush')
  })

  describe('Banner.Title', () => {
    it('should render as a h2 element by default', async () => {
      render(
        <Banner>
          <Banner.Title>test</Banner.Title>
        </Banner>,
      )
      await expect.element(page.getByRole('heading', {level: 2, name: 'test'})).toBeInTheDocument()
    })

    it('should support rendering as any heading element above level 2', async () => {
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
        await expect.element(page.getByRole('heading', {level, name: `test level ${level}`})).toBeInTheDocument()
      }
    })

    it('should support a custom `className` on the container element', async () => {
      render(
        <Banner>
          <Banner.Title className="custom-class">test</Banner.Title>
        </Banner>,
      )
      await expect.element(page.getByRole('heading', {name: 'test'})).toHaveClass('custom-class')
    })

    it('should pass extra props onto the container element', async () => {
      render(
        <Banner>
          <Banner.Title data-testid="test">test</Banner.Title>
        </Banner>,
      )
      await expect.element(page.getByRole('heading', {name: 'test'})).toHaveAttribute('data-testid', 'test')
    })
  })

  describe('Banner.Description', () => {
    it('should support a custom `className` on the container element', async () => {
      render(
        <Banner>
          <Banner.Title>test title</Banner.Title>
          <Banner.Description className="custom-class">test description</Banner.Description>
        </Banner>,
      )
      await expect.element(page.getByText('test description')).toHaveClass('custom-class')
    })

    it('should pass extra props onto the container element', async () => {
      render(
        <Banner>
          <Banner.Title>test title</Banner.Title>
          <Banner.Description data-testid="test">test description</Banner.Description>
        </Banner>,
      )
      await expect.element(page.getByText('test description')).toHaveAttribute('data-testid', 'test')
    })
  })
})
