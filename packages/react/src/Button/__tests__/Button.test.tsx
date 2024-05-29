import {SearchIcon, HeartIcon} from '@primer/octicons-react'
import {render, screen, fireEvent} from '@testing-library/react'
import axe from 'axe-core'
import React from 'react'
import {IconButton, Button} from '../../Button'
import {behavesAsComponent} from '../../utils/testing'

describe('Button', () => {
  behavesAsComponent({Component: Button, options: {skipSx: true}})

  it('renders a <button>', () => {
    const container = render(<Button>Default</Button>)
    const button = container.getByRole('button')
    expect(button.textContent).toEqual('Default')
  })

  it('should have no axe violations', async () => {
    const {container} = render(<Button>Click here</Button>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('preserves "onClick" prop', () => {
    const onClick = jest.fn()
    const container = render(<Button onClick={onClick}>Noop</Button>)
    const button = container.getByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects block prop', () => {
    const container = render(<Button block>Block</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('respects the "disabled" prop', () => {
    const onClick = jest.fn()
    const container = render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button.hasAttribute('disabled')).toEqual(true)
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(0)
  })

  it('respects the small size prop', () => {
    const container = render(<Button size="small">Smol</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('respects the large size prop', () => {
    const container = render(<Button size="large">Smol</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles primary button appropriately', () => {
    const container = render(<Button variant="primary">Primary</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles invisible button appropriately', () => {
    const container = render(<Button variant="invisible">Invisible</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles danger button appropriately', () => {
    const container = render(<Button variant="danger">Danger</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('makes sure icon button has an aria-label', () => {
    const container = render(<IconButton icon={SearchIcon} aria-label="Search button" />)
    const IconOnlyButton = container.getByLabelText('Search button')
    expect(IconOnlyButton).toBeTruthy()
  })

  it('respects the alignContent prop', () => {
    const container = render(<Button alignContent="start">Align start</Button>)
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('should render the leadingVisual prop before the button content', () => {
    render(
      <Button leadingVisual={() => <span data-testid="leadingVisual" />}>
        <span>content</span>
      </Button>,
    )

    expect(screen.getByTestId('leadingVisual')).toBeInTheDocument()

    const position = screen.getByText('content').compareDocumentPosition(screen.getByTestId('leadingVisual'))
    expect(position).toBe(Node.DOCUMENT_POSITION_PRECEDING)
  })

  it('should render the trailingVisual prop after the button content', () => {
    render(
      <Button trailingVisual={() => <span data-testid="trailingVisual" />}>
        <span>content</span>
      </Button>,
    )
    expect(screen.getByTestId('trailingVisual')).toBeInTheDocument()

    const position = screen.getByText('content').compareDocumentPosition(screen.getByTestId('trailingVisual'))
    expect(position).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('should render tooltip on an icon button when unsafeDisableTooltip prop is passed as false', () => {
    const {getByRole, getByText} = render(
      <IconButton icon={HeartIcon} aria-label="Heart" unsafeDisableTooltip={false} />,
    )
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Heart')
    expect(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.id)
  })
  it('should render description type tooltip on an icon button when unsafeDisableTooltip prop is passed as false', () => {
    const {getByRole, getByText} = render(
      <IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" unsafeDisableTooltip={false} />,
    )
    const triggerEL = getByRole('button')
    expect(triggerEL).toHaveAttribute('aria-label', 'Heart')
    const tooltipEl = getByText('Love is all around')
    expect(triggerEL).toHaveAttribute('aria-describedby', tooltipEl.id)
  })
  it('should not render tooltip on an icon button by default', () => {
    const {getByRole} = render(<IconButton icon={HeartIcon} aria-label="Heart" />)
    const triggerEl = getByRole('button')
    expect(triggerEl).not.toHaveAttribute('aria-labelledby')
    expect(triggerEl).toHaveAttribute('aria-label', 'Heart')
  })
})
