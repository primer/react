import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Banner} from '../Banner'

describe('Banner', () => {
  it('should render as a region element', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('region', {name: 'Information'})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'test'})).toBeInTheDocument()
  })

  it('should support a custom `className` on the outermost element', () => {
    const Element = () => <Banner title="test" className="test-class-name" />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('should label the landmark element with the corresponding variant label text', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('region')).toEqual(screen.getByLabelText('Information'))
  })

  it('should label the landmark element with the label for the critical variant', () => {
    render(<Banner title="test" variant="critical" />)
    expect(screen.getByRole('region')).toEqual(screen.getByLabelText('Critical'))
  })

  it('should label the landmark element with the label for the info variant', () => {
    render(<Banner title="test" variant="info" />)
    expect(screen.getByRole('region')).toEqual(screen.getByLabelText('Information'))
  })

  it('should label the landmark element with the label for the success variant', () => {
    render(<Banner title="test" variant="success" />)
    expect(screen.getByRole('region')).toEqual(screen.getByLabelText('Success'))
  })

  it('should label the landmark element with the label for the upsell variant', () => {
    render(<Banner title="test" variant="upsell" />)
    expect(screen.getByRole('region')).toEqual(screen.getByLabelText('Recommendation'))
  })

  it('should label the landmark element with the label for the warning variant', () => {
    render(<Banner title="test" variant="warning" />)
    expect(screen.getByRole('region')).toEqual(screen.getByLabelText('Warning'))
  })

  it('should support the `aria-label` prop to override the default label for the landmark', () => {
    render(<Banner aria-label="Test" title="test" variant="warning" />)
    expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Test')
  })

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

  it('should only set aria-label when aria-labelledby is not provided', () => {
    render(<Banner aria-label="Custom Label" title="test" />)
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-label', 'Custom Label')
    expect(region).not.toHaveAttribute('aria-labelledby')
  })

  it('should default the title to a h2', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument()
    expect(screen.getByRole('heading', {level: 2})).toEqual(screen.getByText('test'))
  })

  it('should throw an error if no title is provided', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => {
      render(<Banner />)
    }).toThrowErrorMatchingSnapshot()
    spy.mockRestore()
  })

  it('should rendering a description with the `description` prop', () => {
    render(<Banner title="test" description="test-description" />)
    expect(screen.getByText('test-description')).toBeInTheDocument()
    expect(screen.getByRole('region', {name: 'Information'})).toContainElement(screen.getByText('test-description'))
  })

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

    await user.click(screen.queryAllByText('test primary action')[0])
    expect(onClick).toHaveBeenCalledTimes(1)
  })

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

    await user.click(screen.queryAllByText('test secondary action')[0])
    expect(onClick).toHaveBeenCalledTimes(1)
  })

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
  })

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

  it.each(['critical', 'info', 'success', 'upsell', 'warning'] as const)(
    'should support onDismiss for the %s variant',
    variant => {
      const onDismiss = vi.fn()
      render(<Banner title="test" description="test-description" onDismiss={onDismiss} variant={variant} />)
      expect(screen.queryByRole('button', {name: 'Dismiss banner'})).toBeInTheDocument()
    },
  )

  it('should pass extra props onto the container element', () => {
    const {container} = render(<Banner title="test" data-testid="test" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
  })

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

  it('should support a custom leadingVisual for info and upsell variants', () => {
    const CustomIcon = vi.fn(() => <svg data-testid="leading-visual" aria-hidden="true" />)
    const {rerender} = render(
      <Banner title="test" description="test-description" variant="info" leadingVisual={<CustomIcon />} />,
    )
    expect(screen.getByTestId('leading-visual')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="upsell" leadingVisual={<CustomIcon />} />)
    expect(screen.getByTestId('leading-visual')).toBeInTheDocument()

    rerender(<Banner title="test" description="test-description" variant="critical" leadingVisual={<CustomIcon />} />)
    expect(screen.queryByTestId('leading-visual')).toBe(null)

    rerender(<Banner title="test" description="test-description" variant="success" leadingVisual={<CustomIcon />} />)
    expect(screen.queryByTestId('leading-visual')).toBe(null)

    rerender(<Banner title="test" description="test-description" variant="warning" leadingVisual={<CustomIcon />} />)
    expect(screen.queryByTestId('leading-visual')).toBe(null)
  })

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

  it('should render data-actions-layout attribute with inline value', () => {
    const {container} = render(<Banner title="test" actionsLayout="inline" />)
    expect(container.firstChild).toHaveAttribute('data-actions-layout', 'inline')
  })

  it('should render data-actions-layout attribute with stacked value', () => {
    const {container} = render(<Banner title="test" actionsLayout="stacked" />)
    expect(container.firstChild).toHaveAttribute('data-actions-layout', 'stacked')
  })

  it('should render data-actions-layout attribute with default value when not specified', () => {
    const {container} = render(<Banner title="test" />)
    expect(container.firstChild).toHaveAttribute('data-actions-layout', 'default')
  })

  describe('Banner.Title', () => {
    it('should render as a h2 element by default', () => {
      render(
        <Banner>
          <Banner.Title>test</Banner.Title>
        </Banner>,
      )
      expect(screen.getByRole('heading', {level: 2, name: 'test'})).toBeInTheDocument()
    })

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
