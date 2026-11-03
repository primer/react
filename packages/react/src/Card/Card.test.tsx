import {page} from 'vitest/browser'
import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {Card} from '../Card'
import {implementsClassName} from '../utils/testing'
import classes from './Card.module.css'

const TestIcon = () => <svg data-testid="test-icon" aria-hidden="true" />

describe('Card', () => {
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
