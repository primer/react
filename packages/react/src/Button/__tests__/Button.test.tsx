import {SearchIcon, HeartIcon} from '@primer/octicons-react'
import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect, vi} from 'vitest'
import React from 'react'
import {IconButton, Button, LinkButton} from '../../Button'

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
  it('should support `className` on the outermost element', () => {
    const Element = () => <IconButton className={'test-class-name'} icon={SearchIcon} aria-label="Search button" />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
})

describe('LinkButton', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <LinkButton className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })
})

describe('Button', () => {
  it('should support `className` on the outermost element', () => {
    const Element = () => <Button className={'test-class-name'} />
    expect(render(<Element />).container.firstChild).toHaveClass('test-class-name')
  })

  it('renders a <button>', () => {
    const container = render(<Button id="test-button">Default</Button>)
    const button = container.getByRole('button')
    expect(button.textContent).toEqual('Default')
  })

  it('preserves "onClick" prop', () => {
    const onClick = vi.fn()
    const container = render(<Button onClick={onClick}>Noop</Button>)
    const button = container.getByRole('button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects block prop', () => {
    const container = render(
      <Button block id="test-button">
        Block
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('respects the "disabled" prop', () => {
    const onClick = vi.fn()
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
    const container = render(
      <Button size="small" id="test-button">
        Smol
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('respects the large size prop', () => {
    const container = render(
      <Button size="large" id="test-button">
        Smol
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles primary button appropriately', () => {
    const container = render(
      <Button variant="primary" id="test-button">
        Primary
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles invisible button appropriately', () => {
    const container = render(
      <Button variant="invisible" id="test-button">
        Invisible
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('styles danger button appropriately', () => {
    const container = render(
      <Button variant="danger" id="test-button">
        Danger
      </Button>,
    )
    const button = container.getByRole('button')
    expect(button).toMatchSnapshot()
  })

  it('makes sure icon button has an aria-label', () => {
    const container = render(<IconButton icon={SearchIcon} aria-label="Search button" />)
    const IconOnlyButton = container.getByLabelText('Search button')
    expect(IconOnlyButton).toBeTruthy()
  })

  it('respects the alignContent prop', () => {
    const container = render(
      <Button alignContent="start" id="test-button">
        Align start
      </Button>,
    )
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

  it('should describe the button with a default loading announcement, and only when the button is in a loading state', async () => {
    const buttonId = 'loading-button'
    const container = render(
      <StatefulLoadingButton id={buttonId}>
        <span>content</span>
      </StatefulLoadingButton>,
    )
    const buttonNode = container.getByRole('button')

    expect(buttonNode.getAttribute('aria-describedby')).toBe(`${buttonId}-loading-announcement`)

    fireEvent.click(buttonNode)

    // Wait for the loading state to be set
    await new Promise(resolve => setTimeout(resolve, 10))

    // Check that the loading announcement element is present
    const loadingAnnouncement = document.getElementById(`${buttonId}-loading-announcement`)
    expect(loadingAnnouncement).toBeInTheDocument()
    expect(loadingAnnouncement?.textContent).toBe('Loading')
  })

  it('should render a custom loading announcement, and only when the button is in a loading state', async () => {
    const buttonId = 'loading-button'
    const container = render(
      <StatefulLoadingButton id={buttonId} loadingAnnouncement="Action loading">
        <span>content</span>
      </StatefulLoadingButton>,
    )
    const buttonNode = container.getByRole('button')

    expect(buttonNode.getAttribute('aria-describedby')).toBe(`${buttonId}-loading-announcement`)

    fireEvent.click(buttonNode)

    // Wait for the loading state to be set
    await new Promise(resolve => setTimeout(resolve, 10))

    // Check that the loading announcement element is present with custom text
    const loadingAnnouncement = document.getElementById(`${buttonId}-loading-announcement`)
    expect(loadingAnnouncement).toBeInTheDocument()
    expect(loadingAnnouncement?.textContent).toBe('Action loading')
  })

  it('should be described by loading announcement AND whatever is passed to aria-describedby', () => {
    const buttonDescriptionId = 'button-description'
    const buttonId = 'loading-button'
    const container = render(
      <StatefulLoadingButton id={buttonId} aria-describedby={buttonDescriptionId}>
        <span>content</span>
      </StatefulLoadingButton>,
    )
    const buttonDescribedBy = container.getByRole('button').getAttribute('aria-describedby')
    const loadingAnnouncementId = `${buttonId}-loading-announcement`

    expect(buttonDescribedBy).toContain(loadingAnnouncementId)

    expect(buttonDescribedBy).toContain(buttonDescriptionId)
  })

  it('should only set aria-disabled to "true" when the button is in a loading state', async () => {
    const container = render(
      <StatefulLoadingButton>
        <span>content</span>
      </StatefulLoadingButton>,
    )
    const buttonNode = container.getByRole('button')

    expect(buttonNode.getAttribute('aria-disabled')).not.toBe('true')

    fireEvent.click(buttonNode)

    // Wait for the loading state to be set
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(buttonNode.getAttribute('aria-disabled')).toBe('true')
  })

  it('allows the consumer to override `aria-disabled`', () => {
    const container = render(<Button aria-disabled>content</Button>)

    expect(container.getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  })

  it('should preserve the accessible button name when the button is in a loading state', () => {
    const container = render(<Button loading>content</Button>)

    expect(container.getByRole('button')).toHaveAccessibleName('content')
  })

  it('should render tooltip on an icon button when unsafeDisableTooltip prop is passed as false', () => {
    const {getByRole, getByText} = render(<IconButton icon={HeartIcon} aria-label="Heart" />)
    const triggerEL = getByRole('button')
    const tooltipEl = getByText('Heart')
    expect(triggerEL).toHaveAttribute('aria-labelledby', tooltipEl.id)
  })
  it('should render description type tooltip on an icon button when unsafeDisableTooltip prop is passed as false', () => {
    const {getByRole, getByText} = render(
      <IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" />,
    )
    const triggerEL = getByRole('button')
    expect(triggerEL).toHaveAttribute('aria-label', 'Heart')
    const tooltipEl = getByText('Love is all around')
    expect(triggerEL.getAttribute('aria-describedby')).toContain(tooltipEl.id)
  })
  it('should render tooltip on an icon button by default', () => {
    const {getByRole, getByText} = render(<IconButton icon={HeartIcon} aria-label="Heart" />)
    const triggerEl = getByRole('button')
    const tooltipEl = getByText('Heart')
    expect(triggerEl).toHaveAttribute('aria-labelledby', tooltipEl.id)
    expect(triggerEl).not.toHaveAttribute('aria-label')
  })
  it('should render aria-keyshorts on an icon button when keyshortcuts prop is passed', () => {
    const {getByRole} = render(<IconButton icon={HeartIcon} aria-label="Heart" keyshortcuts="Command+H" />)
    const triggerEl = getByRole('button')
    expect(triggerEl).toHaveAttribute('aria-keyshortcuts', 'Command+H')
  })
  it('should append the keyshortcuts to the tooltip text that labels the icon button when keyshortcuts prop is passed', () => {
    const {getByRole} = render(<IconButton icon={HeartIcon} aria-label="Heart" keyshortcuts="Command+H" />)
    const triggerEl = getByRole('button', {name: 'Heart (command h)'})
    expect(triggerEl).toBeInTheDocument()
  })
  it('should render aria-keyshortcuts on an icon button when keyshortcuts prop is passed (Description Type)', () => {
    const {getByRole} = render(
      <IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" keyshortcuts="Command+H" />,
    )
    const triggerEl = getByRole('button')
    expect(triggerEl).toHaveAttribute('aria-keyshortcuts', 'Command+H')
  })
  it('should append the keyshortcuts to the tooltip text that describes the icon button when keyshortcuts prop is passed (Description Type)', () => {
    const {getByRole} = render(
      <IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" keyshortcuts="Command+H" />,
    )
    const triggerEl = getByRole('button', {name: 'Heart'})
    expect(triggerEl).toHaveAccessibleDescription('Love is all around (command h)')
  })
  it('should append the keybindingHint to the tooltip text that labels the icon button when keybindingHint prop is passed', () => {
    const {getByRole} = render(<IconButton icon={HeartIcon} aria-label="Heart" keybindingHint="Mod+H" />)
    const triggerEl = getByRole('button', {name: 'Heart (command h)'})
    expect(triggerEl).toBeInTheDocument()
  })
  it('should append the keybindingHint to the tooltip text that describes the icon button when keybindingHint prop is passed (Description Type)', () => {
    const {getByRole} = render(
      <IconButton icon={HeartIcon} aria-label="Heart" description="Love is all around" keybindingHint="Mod+H" />,
    )
    const triggerEl = getByRole('button', {name: 'Heart'})
    expect(triggerEl).toHaveAccessibleDescription('Love is all around (command h)')
  })
})
