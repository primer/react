import {describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Card} from '../Card'
import {implementsClassName} from '../utils/testing'
import classes from './Card.module.css'

const TestIcon = () => <svg data-testid="test-icon" aria-hidden="true" />

describe('Card', () => {
  it('lets a custom body fill the card height without overriding internal grid rows', () => {
    render(
      <Card style={{height: 300}} padding="normal" data-testid="card">
        <div data-testid="body" style={{display: 'flex', flexDirection: 'column'}}>
          <h3>Repository</h3>
          <div data-testid="footer" style={{marginTop: 'auto'}}>
            Updated today
          </div>
        </div>
      </Card>,
    )
    const card = screen.getByTestId('card')
    const body = screen.getByTestId('body')
    const footer = screen.getByTestId('footer')
    const style = getComputedStyle(card)
    const bottomInset = Number.parseFloat(style.paddingBottom) + Number.parseFloat(style.borderBottomWidth)
    expect(body.getBoundingClientRect().bottom).toBeCloseTo(card.getBoundingClientRect().bottom - bottomInset)
    expect(footer.getBoundingClientRect().bottom).toBeCloseTo(body.getBoundingClientRect().bottom)
  })

  it.each([true, false])('bottom-aligns metadata in a stretched card with header=%s', header => {
    render(
      <Card style={{height: 300}} padding="normal" data-testid="card">
        {header && <Card.Icon icon={TestIcon} />}
        <Card.Heading>Repository</Card.Heading>
        <Card.Description>Short description</Card.Description>
        <Card.Metadata data-testid="footer">Updated today</Card.Metadata>
      </Card>,
    )
    const card = screen.getByTestId('card')
    const footer = screen.getByTestId('footer')
    const style = getComputedStyle(card)
    const bottomInset = Number.parseFloat(style.paddingBottom) + Number.parseFloat(style.borderBottomWidth)
    expect(footer.getBoundingClientRect().bottom).toBeCloseTo(card.getBoundingClientRect().bottom - bottomInset)
  })

  it.each(['default', 'compact'] as const)('shrinks long content within a narrow flex parent in %s layout', layout => {
    render(
      <div style={{display: 'flex', width: 160}}>
        <Card layout={layout} padding="normal" data-testid="card">
          <Card.Icon icon={TestIcon} />
          <Card.Heading>{'repository'.repeat(20)}</Card.Heading>
          <Card.Description>Long repository name</Card.Description>
        </Card>
      </div>,
    )
    expect(screen.getByTestId('card').getBoundingClientRect().width).toBeLessThanOrEqual(160)
  })

  it.each(['slots', 'custom'] as const)(
    'preserves the default shadow and supports opting out with %s content',
    content => {
      const children = content === 'slots' ? <Card.Heading>Heading</Card.Heading> : <p>Custom content</p>
      const {container, rerender} = render(<Card>{children}</Card>)
      const card = container.querySelector('[data-component="Card"]')!
      expect(card).toHaveAttribute('data-shadow', 'true')
      expect(getComputedStyle(card).boxShadow).not.toBe('none')

      rerender(<Card shadow={false}>{children}</Card>)
      expect(card).toHaveAttribute('data-shadow', 'false')
      expect(getComputedStyle(card).boxShadow).toBe('none')
      expect(card).not.toHaveAttribute('shadow')

      rerender(<Card shadow>{children}</Card>)
      expect(getComputedStyle(card).boxShadow).not.toBe('none')
    },
  )

  describe.each(['default', 'compact'] as const)('%s layout padding', layout => {
    it.each(['slots', 'custom'] as const)('preserves default padding with %s content', content => {
      const {container} = render(
        <Card layout={layout}>
          {content === 'slots' ? <Card.Heading>Heading</Card.Heading> : <p>Custom content</p>}
        </Card>,
      )
      const card = container.querySelector('[data-component="Card"]')!
      expect(card).toHaveAttribute('data-padding', 'normal')
      expect(getComputedStyle(card).padding).toBe(layout === 'compact' ? '16px' : '24px')
    })

    it.each([
      ['none', 0],
      ['condensed', 8],
      ['regular', 16],
      ['normal', layout === 'compact' ? 16 : 24],
    ] as const)('uses %s padding of %ipx for both content modes', (padding, pixels) => {
      const {container, rerender} = render(
        <Card layout={layout} padding={padding}>
          <Card.Heading>Heading</Card.Heading>
        </Card>,
      )
      const card = container.querySelector('[data-component="Card"]')!
      for (const side of ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft'] as const) {
        expect(getComputedStyle(card)[side]).toBe(`${pixels}px`)
      }
      rerender(
        <Card layout={layout} padding={padding}>
          <p>Custom content</p>
        </Card>,
      )
      expect(getComputedStyle(card).padding).toBe(`${pixels}px`)
    })
  })

  it.each(['none', 'condensed', 'regular', 'normal'] as const)('keeps images edge-to-edge with %s padding', padding => {
    const {container} = render(
      <Card padding={padding} style={{width: 400}}>
        <Card.Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'/%3E" />
        <Card.Heading>Image card</Card.Heading>
      </Card>,
    )
    const card = container.querySelector('[data-component="Card"]')!
    const image = screen.getByRole('presentation')
    const cardBounds = card.getBoundingClientRect()
    const imageBounds = image.getBoundingClientRect()
    const borderWidth = Number.parseFloat(getComputedStyle(card).borderLeftWidth)
    expect(imageBounds.left).toBeCloseTo(cardBounds.left + borderWidth)
    expect(imageBounds.top).toBeCloseTo(cardBounds.top + borderWidth)
    expect(imageBounds.width).toBeCloseTo(cardBounds.width - 2 * borderWidth)
  })

  implementsClassName(
    props => (
      <Card {...props}>
        <Card.Heading>Card Heading</Card.Heading>
      </Card>
    ),
    classes.Card,
  )

  it('should render a Card with heading and description', () => {
    render(
      <Card>
        <Card.Heading>Test Heading</Card.Heading>
        <Card.Description>Test Description</Card.Description>
      </Card>,
    )
    expect(screen.getByText('Test Heading')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  describe('Card.Link', () => {
    implementsClassName(
      props => (
        <Card.Link {...props} href="#repository">
          Repository
        </Card.Link>
      ),
      classes.CardPrimaryAction,
    )

    it('renders a native heading link with a concise accessible name and forwards native attributes and ref', () => {
      const ref = {current: null as HTMLAnchorElement | null}
      render(
        <Card as="section">
          <Card.Heading>
            <Card.Link href="/primer/react" target="_blank" rel="noreferrer" ref={ref}>
              primer/react
            </Card.Link>
          </Card.Heading>
          <Card.Description>Repository details</Card.Description>
        </Card>,
      )
      const link = screen.getByRole('link', {name: 'primer/react'})
      expect(link).toHaveAttribute('href', '/primer/react')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noreferrer')
      expect(link).toHaveAttribute('data-component', 'Card.Link')
      expect(ref.current).toBe(link)
      expect(screen.getByRole('region', {name: 'primer/react'})).toBeInTheDocument()
      expect(screen.getByRole('heading', {name: 'primer/react'})).toContainElement(link)
    })

    it('activates with Enter and keeps secondary actions independent', async () => {
      const user = userEvent.setup()
      const primary = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault())
      const secondary = vi.fn()
      render(
        <Card>
          <Card.Heading>
            <Card.Link href="#repository" onClick={primary}>
              Repository
            </Card.Link>
          </Card.Heading>
          <Card.Action>
            <button type="button" onClick={secondary}>
              More options for Repository
            </button>
          </Card.Action>
        </Card>,
      )
      await user.tab()
      expect(screen.getByRole('link')).toHaveFocus()
      await user.keyboard('{Enter}')
      expect(primary).toHaveBeenCalledTimes(1)
      await user.tab()
      await user.keyboard('{Enter}')
      expect(secondary).toHaveBeenCalledTimes(1)
      expect(primary).toHaveBeenCalledTimes(1)
    })
  })

  describe('Card.Button', () => {
    implementsClassName(props => <Card.Button {...props}>Open details</Card.Button>, classes.CardPrimaryAction)

    it('forwards its ref and native props and does not submit a form by default', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
      const ref = {current: null as HTMLButtonElement | null}
      render(
        <form onSubmit={onSubmit}>
          <Card>
            <Card.Heading>
              <Card.Button ref={ref} onClick={onClick} aria-expanded={false}>
                Open details
              </Card.Button>
            </Card.Heading>
          </Card>
        </form>,
      )
      const button = screen.getByRole('button', {name: 'Open details'})
      expect(button).toHaveAttribute('type', 'button')
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('data-component', 'Card.Button')
      expect(ref.current).toBe(button)
      await user.tab()
      expect(button).toHaveFocus()
      await user.keyboard('{Enter}')
      await user.keyboard(' ')
      expect(onClick).toHaveBeenCalledTimes(2)
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('supports an explicit submit type', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault())
      render(
        <form onSubmit={onSubmit}>
          <Card>
            <Card.Heading>
              <Card.Button type="submit">Submit</Card.Button>
            </Card.Heading>
          </Card>
        </form>,
      )
      await user.click(screen.getByRole('button', {name: 'Submit'}))
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it('does not activate when disabled and leaves secondary controls enabled', async () => {
      const user = userEvent.setup()
      const onClick = vi.fn()
      render(
        <Card>
          <Card.Heading>
            <Card.Button disabled onClick={onClick}>
              Open details
            </Card.Button>
          </Card.Heading>
          <Card.Metadata>
            <button type="button">Secondary action</button>
          </Card.Metadata>
        </Card>,
      )
      await user.click(screen.getByRole('button', {name: 'Open details'}))
      expect(onClick).not.toHaveBeenCalled()
      await user.tab()
      expect(screen.getByRole('button', {name: 'Secondary action'})).toHaveFocus()
    })
  })

  it('should render a heading as an h3 element', () => {
    render(
      <Card>
        <Card.Heading>Heading</Card.Heading>
      </Card>,
    )
    expect(screen.getByRole('heading', {level: 3, name: 'Heading'})).toBeInTheDocument()
  })

  it('should render an icon', () => {
    render(
      <Card>
        <Card.Icon icon={TestIcon} />
        <Card.Heading>With Icon</Card.Heading>
      </Card>,
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should render an image', () => {
    render(
      <Card>
        <Card.Image src="https://example.com/image.png" alt="Example" />
        <Card.Heading>With Image</Card.Heading>
      </Card>,
    )
    const img = screen.getByRole('img', {name: 'Example'})
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.png')
  })

  it('should render metadata', () => {
    render(
      <Card>
        <Card.Heading>Metadata Card</Card.Heading>
        <Card.Metadata>Updated 2 hours ago</Card.Metadata>
      </Card>,
    )
    expect(screen.getByText('Updated 2 hours ago')).toBeInTheDocument()
  })

  it('should render an action', () => {
    render(
      <Card>
        <Card.Heading>Action Card</Card.Heading>
        <Card.Action>
          <button type="button">Options</button>
        </Card.Action>
      </Card>,
    )
    expect(screen.getByRole('button', {name: 'Options'})).toBeInTheDocument()
  })

  it('should apply edge-to-edge styling when image is provided', () => {
    const {container} = render(
      <Card>
        <Card.Image src="https://example.com/image.png" alt="" />
        <Card.Heading>Edge to Edge</Card.Heading>
      </Card>,
    )
    const header = container.querySelector(`.${classes.CardHeader}`)
    expect(header).toHaveClass(classes.CardHeaderEdgeToEdge)
  })

  it('should not apply edge-to-edge styling when only icon is provided', () => {
    const {container} = render(
      <Card>
        <Card.Icon icon={TestIcon} />
        <Card.Heading>With Icon</Card.Heading>
      </Card>,
    )
    const header = container.querySelector(`.${classes.CardHeader}`)
    expect(header).not.toHaveClass(classes.CardHeaderEdgeToEdge)
  })

  it('should support a custom className on the root element', () => {
    const {container} = render(
      <Card className="custom-class">
        <Card.Heading>Custom</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveClass(classes.Card)
  })

  it('should forward a ref to the root element', () => {
    const ref = {current: null as HTMLDivElement | null}
    render(
      <Card ref={ref}>
        <Card.Heading>Ref Card</Card.Heading>
      </Card>,
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should render arbitrary custom content when no subcomponents are used', () => {
    render(
      <Card>
        <div data-testid="custom-content">
          <p>Custom paragraph</p>
        </div>
      </Card>,
    )
    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Custom paragraph')).toBeInTheDocument()
  })

  it('should set data-padding to normal by default', () => {
    const {container} = render(
      <Card>
        <Card.Heading>Padded</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-padding', 'normal')
  })

  it('should set data-padding to none when padding="none"', () => {
    const {container} = render(
      <Card padding="none">
        <Card.Heading>No Padding</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-padding', 'none')
  })

  it('should set data-padding on custom content cards', () => {
    const {container} = render(
      <Card padding="none">
        <p>Custom</p>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-padding', 'none')
  })

  it('should set data-border-radius to large by default', () => {
    const {container} = render(
      <Card>
        <Card.Heading>Default Radius</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-border-radius', 'large')
  })

  it('should set data-border-radius to medium when borderRadius="medium"', () => {
    const {container} = render(
      <Card borderRadius="medium">
        <Card.Heading>Medium Radius</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-border-radius', 'medium')
  })

  it('should set data-component attributes on Card and its subcomponents', () => {
    const {container} = render(
      <Card>
        <Card.Icon icon={TestIcon} />
        <Card.Heading>With data-component</Card.Heading>
        <Card.Description>Description text</Card.Description>
        <Card.Metadata>Metadata text</Card.Metadata>
        <Card.Action>
          <button type="button">Options</button>
        </Card.Action>
      </Card>,
    )
    expect(container.querySelector('[data-component="Card"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Card.Icon"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Card.Heading"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Card.Description"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Card.Metadata"]')).toBeInTheDocument()
    expect(container.querySelector('[data-component="Card.Action"]')).toBeInTheDocument()
  })

  it('should set data-component="Card.Image" on Card.Image', () => {
    const {container} = render(
      <Card>
        <Card.Image src="https://example.com/image.png" alt="" />
        <Card.Heading>With Image</Card.Heading>
      </Card>,
    )
    expect(container.querySelector('[data-component="Card.Image"]')).toBeInTheDocument()
  })

  it('should set data-component="Card" on custom content cards', () => {
    const {container} = render(
      <Card>
        <p>Custom</p>
      </Card>,
    )
    expect(container.querySelector('[data-component="Card"]')).toBeInTheDocument()
  })

  it('should not render when there are no children', () => {
    // @ts-expect-error - children is required, but we want to verify the runtime behaviour
    const {container} = render(<Card />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should not render when all children are falsy', () => {
    const {container} = render(<Card>{false}</Card>)
    expect(container).toBeEmptyDOMElement()
  })

  it('should render as a <div> by default', () => {
    const {container} = render(
      <Card>
        <Card.Heading>Default Element</Card.Heading>
      </Card>,
    )
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('should render as a <section> when as="section"', () => {
    const {container} = render(
      <Card as="section" aria-label="Standalone card">
        <Card.Heading>Standalone</Card.Heading>
        <Card.Description>This card is standalone.</Card.Description>
      </Card>,
    )
    expect(container.firstChild?.nodeName).toBe('SECTION')
    expect(container.firstChild).toHaveAttribute('aria-label', 'Standalone card')
  })

  it('should expose the section as a labelled region landmark', () => {
    render(
      <Card as="section" aria-labelledby="standalone-heading">
        <Card.Heading id="standalone-heading">Standalone</Card.Heading>
        <Card.Description>This card is standalone.</Card.Description>
      </Card>,
    )
    expect(screen.getByRole('region', {name: 'Standalone'})).toBeInTheDocument()
  })

  it('should auto-wire aria-labelledby to Card.Heading when as="section"', () => {
    render(
      <Card as="section">
        <Card.Heading>Auto-wired</Card.Heading>
        <Card.Description>No manual id needed.</Card.Description>
      </Card>,
    )
    expect(screen.getByRole('region', {name: 'Auto-wired'})).toBeInTheDocument()
  })

  it('should not forward the `as` prop to the DOM', () => {
    const {container} = render(
      <Card as="section" aria-label="Standalone card">
        <Card.Heading>Heading</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).not.toHaveAttribute('as')
  })

  it('should set data-layout to default by default', () => {
    const {container} = render(
      <Card>
        <Card.Heading>Default Variant</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-layout', 'default')
  })

  it('should set data-layout to compact when layout="compact"', () => {
    const {container} = render(
      <Card layout="compact">
        <Card.Icon icon={TestIcon} />
        <Card.Heading>Compact Card</Card.Heading>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-layout', 'compact')
  })

  it('should set data-layout on custom content cards', () => {
    const {container} = render(
      <Card layout="compact">
        <p>Custom</p>
      </Card>,
    )
    expect(container.firstChild).toHaveAttribute('data-layout', 'compact')
  })
})
