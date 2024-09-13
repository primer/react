import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {Banner} from '../Banner'

describe('Banner', () => {
  let spy: jest.SpyInstance

  beforeEach(() => {
    // Note: this error occurs due to our usage of `@container` within a
    // `<style>` tag in Banner. The CSS parser for jsdom does not support this
    // syntax and will fail with an error containing the message below.
    // eslint-disable-next-line no-console
    const originalConsoleError = console.error
    spy = jest.spyOn(console, 'error').mockImplementation((value, ...args) => {
      if (!value?.message?.includes('Could not parse CSS stylesheet')) {
        originalConsoleError(value, ...args)
      }
    })
  })

  afterEach(() => {
    spy.mockRestore()
  })

  it('should render as a region element', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('region', {name: 'Information'})).toBeInTheDocument()
    expect(screen.getByRole('heading', {name: 'test'})).toBeInTheDocument()
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

  it('should default the title to a h2', () => {
    render(<Banner title="test" />)
    expect(screen.getByRole('heading', {level: 2})).toBeInTheDocument()
    expect(screen.getByRole('heading', {level: 2})).toEqual(screen.getByText('test'))
  })

  it('should throw an error if no title is provided', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
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
    const onClick = jest.fn()
    render(
      <Banner
        title="test"
        description="test-description"
        primaryAction={<Banner.PrimaryAction onClick={onClick}>test primary action</Banner.PrimaryAction>}
      />,
    )

    expect(screen.getByRole('button', {name: 'test primary action'})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'test primary action'}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should support a secondary action', async () => {
    const user = userEvent.setup()
    const onClick = jest.fn()
    render(
      <Banner
        title="test"
        description="test-description"
        secondaryAction={<Banner.SecondaryAction onClick={onClick}>test secondary action</Banner.SecondaryAction>}
      />,
    )

    expect(screen.getByRole('button', {name: 'test secondary action'})).toBeInTheDocument()

    await user.click(screen.getByRole('button', {name: 'test secondary action'}))
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

    expect(screen.getByRole('button', {name: 'test primary action'})).toBeInTheDocument()
    expect(screen.getByRole('button', {name: 'test secondary action'})).toBeInTheDocument()
  })

  it('should call `onDismiss` when the dismiss button is activated', async () => {
    const user = userEvent.setup()
    const onDismiss = jest.fn()
    render(<Banner title="test" description="test-description" onDismiss={onDismiss} />)

    await user.click(screen.getByRole('button', {name: 'Dismiss banner'}))
    expect(onDismiss).toHaveBeenCalledTimes(1)

    expect(screen.getByRole('button', {name: 'Dismiss banner'})).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(onDismiss).toHaveBeenCalledTimes(2)

    await user.type(screen.getByRole('button', {name: 'Dismiss banner'}), '{Space}')
    expect(onDismiss).toHaveBeenCalledTimes(3)
  })

  it('should not support onDismiss when `variant="critical"`', () => {
    const onDismiss = jest.fn()
    render(<Banner title="test" description="test-description" onDismiss={onDismiss} variant="critical" />)
    expect(screen.queryByRole('button', {name: 'Dismiss banner'})).toBe(null)
  })

  it('should pass extra props onto the container element', () => {
    const {container} = render(<Banner title="test" data-testid="test" />)
    expect(container.firstChild).toHaveAttribute('data-testid', 'test')
  })

  it('should support a custom icon for info and upsell variants', () => {
    const CustomIcon = jest.fn(() => <svg data-testid="icon" aria-hidden="true" />)
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
