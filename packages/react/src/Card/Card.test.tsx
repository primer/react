import {page, userEvent} from 'vitest/browser'
import {describe, expect, it, vi} from 'vitest'
import {render} from '@testing-library/react'
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
    const card = page.getByTestId('card').element()
    const body = page.getByTestId('body').element()
    const footer = page.getByTestId('footer').element()
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
    const card = page.getByTestId('card').element()
    const footer = page.getByTestId('footer').element()
    expect(footer.getBoundingClientRect().bottom).toBeCloseTo(card.getBoundingClientRect().bottom - 17)
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
    expect(page.getByTestId('card').element().getBoundingClientRect().width).toBeLessThanOrEqual(160)
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
    it.each(['slots', 'custom'] as const)('defaults to 16px padding with %s content', content => {
      const {container} = render(
        <Card layout={layout}>
          {content === 'slots' ? <Card.Heading>Heading</Card.Heading> : <p>Custom content</p>}
        </Card>,
      )
      const card = container.querySelector('[data-component="Card"]')!
      expect(card).toHaveAttribute('data-padding', 'normal')
      expect(getComputedStyle(card).padding).toBe('16px')
    })

    it.each([
      ['none', 0],
      ['condensed', 8],
      ['normal', 16],
      ['spacious', 24],
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

  it.each(['none', 'condensed', 'normal', 'spacious'] as const)(
    'keeps images edge-to-edge with %s padding',
    padding => {
      const {container} = render(
        <Card padding={padding} style={{width: 400}}>
          <Card.Image src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'/%3E" />
          <Card.Heading>Image card</Card.Heading>
        </Card>,
      )
      const card = container.querySelector('[data-component="Card"]')!
      const image = page.getByRole('presentation').element()
      const cardBounds = card.getBoundingClientRect()
      const imageBounds = image.getBoundingClientRect()
      const borderWidth = Number.parseFloat(getComputedStyle(card).borderLeftWidth)
      expect(imageBounds.left).toBeCloseTo(cardBounds.left + borderWidth)
      expect(imageBounds.top).toBeCloseTo(cardBounds.top + borderWidth)
      expect(imageBounds.width).toBeCloseTo(cardBounds.width - 2 * borderWidth)
    },
  )

  implementsClassName(
    props => (
      <Card {...props}>
        <Card.Heading>Card Heading</Card.Heading>
      </Card>
    ),
    classes.Card,
  )

  it('should render a Card with heading and description', async () => {
    render(
      <Card>
        <Card.Heading>Test Heading</Card.Heading>
        <Card.Description>Test Description</Card.Description>
      </Card>,
    )
    await expect.element(page.getByText('Test Heading')).toBeInTheDocument()
    await expect.element(page.getByText('Test Description')).toBeInTheDocument()
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

    it('renders a native heading link with a concise accessible name and forwards native attributes and ref', async () => {
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
      const link = page.getByRole('link', {name: 'primer/react'})
      await expect.element(link).toHaveAttribute('href', '/primer/react')
      await expect.element(link).toHaveAttribute('target', '_blank')
      await expect.element(link).toHaveAttribute('rel', 'noreferrer')
      await expect.element(link).toHaveAttribute('data-component', 'Card.Link')
      expect(ref.current).toBe(link.element())
      await expect.element(page.getByRole('region', {name: 'primer/react'})).toBeInTheDocument()
      await expect.element(page.getByRole('heading', {name: 'primer/react'})).toContainElement(link.element())
    })

    it('activates with Enter and keeps secondary actions independent', async () => {
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
      await userEvent.tab()
      await expect.element(page.getByRole('link')).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      expect(primary).toHaveBeenCalledTimes(1)
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
      expect(secondary).toHaveBeenCalledTimes(1)
      expect(primary).toHaveBeenCalledTimes(1)
    })
  })

  describe('Card.Button', () => {
    implementsClassName(props => <Card.Button {...props}>Open details</Card.Button>, classes.CardPrimaryAction)

    it('forwards its ref and native props and does not submit a form by default', async () => {
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
      const button = page.getByRole('button', {name: 'Open details'})
      await expect.element(button).toHaveAttribute('type', 'button')
      await expect.element(button).toHaveAttribute('aria-expanded', 'false')
      await expect.element(button).toHaveAttribute('data-component', 'Card.Button')
      expect(ref.current).toBe(button.element())
      await userEvent.tab()
      await expect.element(button).toHaveFocus()
      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')
      expect(onClick).toHaveBeenCalledTimes(2)
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('supports an explicit submit type', async () => {
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
      await page.getByRole('button', {name: 'Submit'}).click()
      expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it('does not activate when disabled and leaves secondary controls enabled', async () => {
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
      const button = page.getByRole('button', {name: 'Open details'})
      await expect.element(button).toBeDisabled()
      button.element().click()
      expect(onClick).not.toHaveBeenCalled()
      await userEvent.tab()
      await expect.element(page.getByRole('button', {name: 'Secondary action'})).toHaveFocus()
    })
  })

  it('should render a heading as an h3 element', async () => {
    render(
      <Card>
        <Card.Heading>Heading</Card.Heading>
      </Card>,
    )
    await expect.element(page.getByRole('heading', {level: 3, name: 'Heading'})).toBeInTheDocument()
  })

  it('should render an icon', async () => {
    render(
      <Card>
        <Card.Icon icon={TestIcon} />
        <Card.Heading>With Icon</Card.Heading>
      </Card>,
    )
    await expect.element(page.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('should render an image', async () => {
    render(
      <Card>
        <Card.Image src="https://example.com/image.png" alt="Example" />
        <Card.Heading>With Image</Card.Heading>
      </Card>,
    )
    const img = page.getByRole('img', {name: 'Example'})
    await expect.element(img).toBeInTheDocument()
    await expect.element(img).toHaveAttribute('src', 'https://example.com/image.png')
  })

  it('should render metadata', async () => {
    render(
      <Card>
        <Card.Heading>Metadata Card</Card.Heading>
        <Card.Metadata>Updated 2 hours ago</Card.Metadata>
      </Card>,
    )
    await expect.element(page.getByText('Updated 2 hours ago')).toBeInTheDocument()
  })

  it('should render an action', async () => {
    render(
      <Card>
        <Card.Heading>Action Card</Card.Heading>
        <Card.Action>
          <button type="button">Options</button>
        </Card.Action>
      </Card>,
    )
    await expect.element(page.getByRole('button', {name: 'Options'})).toBeInTheDocument()
  })

  it('should apply edge-to-edge styling when image is provided', async () => {
    const {container} = render(
      <Card>
        <Card.Image src="https://example.com/image.png" alt="" />
        <Card.Heading>Edge to Edge</Card.Heading>
      </Card>,
    )
    const header = container.querySelector<HTMLElement>(`.${classes.CardHeader}`)
    await expect.element(header).toHaveClass(classes.CardHeaderEdgeToEdge)
  })

  it('should not apply edge-to-edge styling when only icon is provided', async () => {
    const {container} = render(
      <Card>
        <Card.Icon icon={TestIcon} />
        <Card.Heading>With Icon</Card.Heading>
      </Card>,
    )
    const header = container.querySelector<HTMLElement>(`.${classes.CardHeader}`)
    await expect.element(header).not.toHaveClass(classes.CardHeaderEdgeToEdge)
  })

  it('should support a custom className on the root element', async () => {
    const {container} = render(
      <Card className="custom-class">
        <Card.Heading>Custom</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveClass('custom-class')
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveClass(classes.Card)
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

  it('should render arbitrary custom content when no subcomponents are used', async () => {
    render(
      <Card>
        <div data-testid="custom-content">
          <p>Custom paragraph</p>
        </div>
      </Card>,
    )
    await expect.element(page.getByTestId('custom-content')).toBeInTheDocument()
    await expect.element(page.getByText('Custom paragraph')).toBeInTheDocument()
  })

  it('should set data-padding to normal by default', async () => {
    const {container} = render(
      <Card>
        <Card.Heading>Padded</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-padding', 'normal')
  })

  it('should set data-padding to none when padding="none"', async () => {
    const {container} = render(
      <Card padding="none">
        <Card.Heading>No Padding</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-padding', 'none')
  })

  it('should set data-padding on custom content cards', async () => {
    const {container} = render(
      <Card padding="none">
        <p>Custom</p>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-padding', 'none')
  })

  it('should set data-border-radius to large by default', async () => {
    const {container} = render(
      <Card>
        <Card.Heading>Default Radius</Card.Heading>
      </Card>,
    )
    await expect
      .element(container.querySelector<HTMLElement>(':first-child'))
      .toHaveAttribute('data-border-radius', 'large')
  })

  it('should set data-border-radius to medium when borderRadius="medium"', async () => {
    const {container} = render(
      <Card borderRadius="medium">
        <Card.Heading>Medium Radius</Card.Heading>
      </Card>,
    )
    await expect
      .element(container.querySelector<HTMLElement>(':first-child'))
      .toHaveAttribute('data-border-radius', 'medium')
  })

  it('should set data-component attributes on Card and its subcomponents', async () => {
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
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card"]')).toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card.Icon"]')).toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card.Heading"]')).toBeInTheDocument()
    await expect
      .element(container.querySelector<HTMLElement>('[data-component="Card.Description"]'))
      .toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card.Metadata"]')).toBeInTheDocument()
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card.Action"]')).toBeInTheDocument()
  })

  it('should set data-component="Card.Image" on Card.Image', async () => {
    const {container} = render(
      <Card>
        <Card.Image src="https://example.com/image.png" alt="" />
        <Card.Heading>With Image</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card.Image"]')).toBeInTheDocument()
  })

  it('should set data-component="Card" on custom content cards', async () => {
    const {container} = render(
      <Card>
        <p>Custom</p>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>('[data-component="Card"]')).toBeInTheDocument()
  })

  it('should not render when there are no children', async () => {
    // @ts-expect-error - children is required, but we want to verify the runtime behaviour
    const {container} = render(<Card />)
    await expect.element(container).toBeEmptyDOMElement()
  })

  it('should not render when all children are falsy', async () => {
    const {container} = render(<Card>{false}</Card>)
    await expect.element(container).toBeEmptyDOMElement()
  })

  it('should render as a <div> by default', () => {
    const {container} = render(
      <Card>
        <Card.Heading>Default Element</Card.Heading>
      </Card>,
    )
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('should render as a <section> when as="section"', async () => {
    const {container} = render(
      <Card as="section" aria-label="Standalone card">
        <Card.Heading>Standalone</Card.Heading>
        <Card.Description>This card is standalone.</Card.Description>
      </Card>,
    )
    expect(container.firstChild?.nodeName).toBe('SECTION')
    await expect
      .element(container.querySelector<HTMLElement>(':first-child'))
      .toHaveAttribute('aria-label', 'Standalone card')
  })

  it('should expose the section as a labelled region landmark', async () => {
    render(
      <Card as="section" aria-labelledby="standalone-heading">
        <Card.Heading id="standalone-heading">Standalone</Card.Heading>
        <Card.Description>This card is standalone.</Card.Description>
      </Card>,
    )
    await expect.element(page.getByRole('region', {name: 'Standalone'})).toBeInTheDocument()
  })

  it('should auto-wire aria-labelledby to Card.Heading when as="section"', async () => {
    render(
      <Card as="section">
        <Card.Heading>Auto-wired</Card.Heading>
        <Card.Description>No manual id needed.</Card.Description>
      </Card>,
    )
    await expect.element(page.getByRole('region', {name: 'Auto-wired'})).toBeInTheDocument()
  })

  it('should not forward the `as` prop to the DOM', async () => {
    const {container} = render(
      <Card as="section" aria-label="Standalone card">
        <Card.Heading>Heading</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).not.toHaveAttribute('as')
  })

  it('should set data-layout to default by default', async () => {
    const {container} = render(
      <Card>
        <Card.Heading>Default Variant</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-layout', 'default')
  })

  it('should set data-layout to compact when layout="compact"', async () => {
    const {container} = render(
      <Card layout="compact">
        <Card.Icon icon={TestIcon} />
        <Card.Heading>Compact Card</Card.Heading>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-layout', 'compact')
  })

  it('should set data-layout on custom content cards', async () => {
    const {container} = render(
      <Card layout="compact">
        <p>Custom</p>
      </Card>,
    )
    await expect.element(container.querySelector<HTMLElement>(':first-child')).toHaveAttribute('data-layout', 'compact')
  })
})
