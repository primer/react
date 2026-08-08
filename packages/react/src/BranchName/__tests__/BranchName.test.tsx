import BranchName from '../BranchName'
import {render as HTMLRender, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import {GitBranchIcon, CopyIcon} from '@primer/octicons-react'
import classes from '../BranchName.module.css'
import {implementsClassName} from '../../utils/testing'

describe('BranchName', () => {
  implementsClassName(BranchName, classes.BranchName)

  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<BranchName />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('renders data-component attribute', () => {
    const {container} = HTMLRender(<BranchName />)
    expect(container.querySelector('[data-component="BranchName"]')).toBeInTheDocument()
  })

  describe('BranchName.LeadingVisual', () => {
    it('renders leading visual icon', () => {
      render(
        <BranchName href="#">
          <BranchName.LeadingVisual>
            <GitBranchIcon />
          </BranchName.LeadingVisual>
          branch_name
        </BranchName>,
      )

      expect(screen.getByRole('link', {name: /branch_name/})).toBeInTheDocument()
      // Icon should be rendered
      expect(document.querySelector('svg')).toBeInTheDocument()
    })

    it('merges className and forwards props', () => {
      render(
        <BranchName href="#">
          <BranchName.LeadingVisual className="custom" data-testid="leading-visual">
            <GitBranchIcon />
          </BranchName.LeadingVisual>
          branch_name
        </BranchName>,
      )

      expect(screen.getByTestId('leading-visual')).toHaveClass('custom')
    })
  })

  describe('BranchName.TrailingAction', () => {
    it('renders trailing action button', () => {
      const handleClick = vi.fn()

      render(
        <BranchName href="#">
          branch_name
          <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name" onClick={handleClick} />
        </BranchName>,
      )

      expect(screen.getByRole('link', {name: /branch_name/})).toBeInTheDocument()
      expect(screen.getByRole('button', {name: 'Copy branch name'})).toBeInTheDocument()
    })

    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(
        <BranchName href="#">
          branch_name
          <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name" onClick={handleClick} />
        </BranchName>,
      )

      await user.click(screen.getByRole('button', {name: 'Copy branch name'}))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('forwards ref to the button', () => {
      const ref = {current: null as HTMLButtonElement | null}

      render(
        <BranchName href="#">
          branch_name
          <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name" ref={ref} />
        </BranchName>,
      )

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    })

    it('merges className and forwards props to the button', () => {
      render(
        <BranchName href="#">
          branch_name
          <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name" className="custom" type="submit" />
        </BranchName>,
      )

      const button = screen.getByRole('button', {name: 'Copy branch name'})
      expect(button).toHaveClass('custom')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('description prop', () => {
    it('renders tooltip with description text', async () => {
      const user = userEvent.setup()

      render(
        <BranchName href="#" description="owner/repo:branch_name">
          branch_name
        </BranchName>,
      )

      const link = screen.getByRole('link', {name: /branch_name/})
      await user.hover(link)

      await waitFor(() => {
        // Tooltip is aria-hidden so we need to query by data-component
        const tooltip = document.querySelector('[data-component="Tooltip"]')
        expect(tooltip).toHaveTextContent('owner/repo:branch_name')
      })
    })

    it('uses aria-describedby for the description', () => {
      render(
        <BranchName href="#" description="owner/repo:branch_name">
          branch_name
        </BranchName>,
      )

      const link = screen.getByRole('link', {name: /branch_name/})
      // aria-describedby is set immediately, no hover needed
      expect(link).toHaveAttribute('aria-describedby')
    })
  })

  describe('compound API kitchen sink', () => {
    it('renders with leading visual, description, and trailing action', async () => {
      const handleCopy = vi.fn()

      render(
        <BranchName href="#" description="primer/react:main">
          <BranchName.LeadingVisual>
            <GitBranchIcon />
          </BranchName.LeadingVisual>
          main
          <BranchName.TrailingAction icon={CopyIcon} aria-label="Copy branch name" onClick={handleCopy} />
        </BranchName>,
      )

      // Link is rendered
      expect(screen.getByRole('link', {name: /main/})).toBeInTheDocument()
      // Icon is rendered (2 icons: leading visual + trailing action)
      expect(document.querySelectorAll('svg').length).toBe(2)
      // Button is rendered
      expect(screen.getByRole('button', {name: 'Copy branch name'})).toBeInTheDocument()
    })
  })

  describe('backwards compatibility', () => {
    it('renders simple BranchName without new features', () => {
      render(<BranchName href="#">branch_name</BranchName>)

      expect(screen.getByRole('link', {name: 'branch_name'})).toBeInTheDocument()
    })

    it('renders as span when as="span"', () => {
      render(<BranchName as="span">branch_name</BranchName>)

      expect(screen.queryByRole('link')).not.toBeInTheDocument()
      expect(screen.getByText('branch_name')).toBeInTheDocument()
    })
  })
})
