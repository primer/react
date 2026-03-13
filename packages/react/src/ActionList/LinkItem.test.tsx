import {describe, it, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import React from 'react'
import {ActionList} from '.'
import Link from '../Link'
import {implementsClassName} from '../utils/testing'

describe('ActionList.LinkItem', () => {
  implementsClassName(ActionList.LinkItem)

  it('renders as an anchor by default', () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#home">Home</ActionList.LinkItem>
      </ActionList>,
    )

    const link = screen.getByRole('link', {name: 'Home'})
    expect(link).toHaveAttribute('href', '#home')
    expect(link.tagName).toBe('A')
  })

  it('calls onClick handler', () => {
    const onClick = vi.fn()

    render(
      <ActionList>
        <ActionList.LinkItem role="link" onClick={onClick}>
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    fireEvent.click(screen.getByRole('link', {name: 'Home'}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  describe('as prop', () => {
    it('supports polymorphic LinkItem with as prop', () => {
      const CustomLink = React.forwardRef<
        HTMLAnchorElement,
        React.AnchorHTMLAttributes<HTMLAnchorElement> & {custom: boolean}
      >(({children, custom, ...props}, ref) => (
        <a ref={ref} data-custom-link={custom} {...props}>
          {children}
        </a>
      ))
      CustomLink.displayName = 'CustomLink'

      render(
        <ActionList>
          <ActionList.LinkItem as={CustomLink} href="#docs" custom={true}>
            Docs
          </ActionList.LinkItem>
        </ActionList>,
      )

      const link = screen.getByRole('link', {name: 'Docs'})
      expect(link).toHaveAttribute('data-custom-link', 'true')
      expect(link).toHaveAttribute('href', '#docs')
    })

    it('passes through additional props to the element specified by as', () => {
      render(
        <ActionList>
          <ActionList.LinkItem as={Link} href="#home" data-testid="home-link" inline>
            Home
          </ActionList.LinkItem>
        </ActionList>,
      )

      const homeLink = screen.getByTestId('home-link')
      expect(homeLink).toHaveAttribute('href', '#home')
      expect(homeLink).toHaveAttribute('data-inline', 'true')
    })
  })

  it('renders inactive text when inactiveText is provided', () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#home" inactiveText="Unavailable due to an outage">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.getByText('Unavailable due to an outage')).toBeInTheDocument()
  })
})
