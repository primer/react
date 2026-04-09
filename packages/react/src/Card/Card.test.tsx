import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Card} from '../Card'
import {implementsClassName} from '../utils/testing'
import classes from './Card.module.css'

const TestIcon = () => <svg data-testid="test-icon" aria-hidden="true" />

describe('Card', () => {
  implementsClassName(props => <Card {...props} />, classes.Card)

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

  it('should render a menu', () => {
    render(
      <Card>
        <Card.Heading>Menu Card</Card.Heading>
        <Card.Menu>
          <button type="button">Options</button>
        </Card.Menu>
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
})
