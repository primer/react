import {page, userEvent} from 'vitest/browser'
import {describe, it, expect, vi} from 'vitest'
import {render} from '@testing-library/react'
import React from 'react'
import {ActionList} from '.'
import Link from '../Link'
import {implementsClassName} from '../utils/testing'

describe('ActionList.LinkItem', () => {
  implementsClassName(ActionList.LinkItem)

  it('renders as an anchor by default', async () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#home">Home</ActionList.LinkItem>
      </ActionList>,
    )

    const link = page.getByRole('link', {name: 'Home', exact: true})
    await expect.element(link).toHaveAttribute('href', '#home')
    expect(link.element().tagName).toBe('A')
  })

  it('forwards its ref to the link when wrapped in a tooltip', () => {
    const ref = React.createRef<HTMLAnchorElement>()

    render(
      <ActionList>
        <ActionList.LinkItem ref={ref} href="#home" _PrivateTooltipText="Go home">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(ref.current).toBe(page.getByRole('link', {name: 'Home', exact: true}).element())
  })

  it('calls onClick handler', async () => {
    const onClick = vi.fn()

    render(
      <ActionList>
        <ActionList.LinkItem role="link" onClick={onClick}>
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    await userEvent.click(page.getByRole('link', {name: 'Home', exact: true}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  describe('as prop', () => {
    it('supports polymorphic LinkItem with as prop', async () => {
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

      const link = page.getByRole('link', {name: 'Docs', exact: true})
      await expect.element(link).toHaveAttribute('data-custom-link', 'true')
      await expect.element(link).toHaveAttribute('href', '#docs')
    })

    it('passes through additional props to the element specified by as', async () => {
      render(
        <ActionList>
          <ActionList.LinkItem as={Link} href="#home" data-testid="home-link" inline>
            Home
          </ActionList.LinkItem>
        </ActionList>,
      )

      const homeLink = page.getByTestId('home-link')
      await expect.element(homeLink).toHaveAttribute('href', '#home')
      await expect.element(homeLink).toHaveAttribute('data-inline', 'true')
    })
  })

  it('renders inactive text when inactiveText is provided', async () => {
    render(
      <ActionList>
        <ActionList.LinkItem href="#home" inactiveText="Unavailable due to an outage">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    await expect.element(page.getByText('Unavailable due to an outage', {exact: true})).toBeInTheDocument()
  })
})
