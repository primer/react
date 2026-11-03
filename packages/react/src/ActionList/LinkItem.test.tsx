import {describe, it, expect, vi} from 'vitest'
import {render, screen, fireEvent, waitFor} from '@testing-library/react'
import React from 'react'
import {ActionList} from '.'
import Link from '../Link'
import {implementsClassName} from '../utils/testing'
import spinnerClasses from '../Spinner/Spinner.module.css'
import {ActionListContainerContext} from './ActionListContainerContext'

describe('ActionList.LinkItem', () => {
  implementsClassName(ActionList.LinkItem)

  it.each([undefined, 'Go home'])('preserves the link, animation, and focus with tooltip %s', async tooltipText => {
    const content = (
      <ActionList>
        <ActionList.LinkItem href="#home" _PrivateTooltipText={tooltipText}>
          <span data-testid="animated-child" className={spinnerClasses.SpinnerAnimation}>
            Home
          </span>
        </ActionList.LinkItem>
      </ActionList>
    )
    const {rerender} = render(content)
    const link = screen.getByRole('link', {name: 'Home'})
    const child = screen.getByTestId('animated-child')
    link.focus()
    const [animation] = child.getAnimations()
    expect(animation).toBeDefined()
    await animation.ready
    const startTime = animation.startTime

    // Use a fresh element tree so React cannot skip the parent render.
    rerender(
      <ActionList>
        <ActionList.LinkItem href="#home" _PrivateTooltipText={tooltipText}>
          <span data-testid="animated-child" className={spinnerClasses.SpinnerAnimation}>
            Home
          </span>
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.getByRole('link', {name: 'Home'})).toBe(link)
    expect(screen.getByTestId('animated-child')).toBe(child)
    expect(link).toHaveFocus()
    expect(child.getAnimations()[0]).toBe(animation)
    expect(animation.startTime).toBe(startTime)
  })

  it('updates link props and handlers without replacing the link', () => {
    const originalClick = vi.fn()
    const updatedClick = vi.fn()
    const {rerender} = render(
      <ActionList>
        <ActionList.LinkItem href="#home" onClick={originalClick}>
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )
    const link = screen.getByRole('link', {name: 'Home'})
    fireEvent.click(link)

    rerender(
      <ActionList>
        <ActionList.LinkItem href="#docs" onClick={updatedClick}>
          Docs
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.getByRole('link', {name: 'Docs'})).toBe(link)
    expect(link).toHaveAttribute('href', '#docs')
    fireEvent.click(link)
    expect(originalClick).toHaveBeenCalledTimes(1)
    expect(updatedClick).toHaveBeenCalledTimes(1)
  })

  it('keeps multiple items isolated and updates their children', () => {
    const firstClick = vi.fn()
    const secondClick = vi.fn()
    const renderItems = (working: boolean) => (
      <ActionList>
        <ActionList.LinkItem href="#first" onClick={firstClick}>
          First
        </ActionList.LinkItem>
        <ActionList.LinkItem href="#second" onClick={secondClick}>
          Second {working ? 'working' : 'completed'}
        </ActionList.LinkItem>
      </ActionList>
    )
    const {rerender} = render(renderItems(false))
    const first = screen.getByRole('link', {name: 'First'})
    const second = screen.getByRole('link', {name: 'Second completed'})
    first.focus()
    rerender(renderItems(true))

    expect(screen.getByRole('link', {name: 'First'})).toBe(first)
    expect(screen.getByRole('link', {name: 'Second working'})).toBe(second)
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('href', '#first')
    expect(second).toHaveAttribute('href', '#second')
    fireEvent.click(first)
    expect(firstClick).toHaveBeenCalledTimes(1)
    expect(secondClick).not.toHaveBeenCalled()
    fireEvent.click(second)
    expect(secondClick).toHaveBeenCalledTimes(1)
  })

  it('calls the item handler before the consumer click handler', () => {
    const calls: string[] = []
    render(
      <ActionListContainerContext.Provider value={{afterSelect: () => calls.push('item')}}>
        <ActionList>
          <ActionList.LinkItem href="#home" onClick={() => calls.push('consumer')}>
            Home
          </ActionList.LinkItem>
        </ActionList>
      </ActionListContainerContext.Provider>,
    )

    fireEvent.click(screen.getByRole('link', {name: 'Home'}))
    expect(calls).toEqual(['item', 'consumer'])
  })

  it('updates custom link props, callback refs, and tooltip text without remounting', () => {
    const CustomLink = React.forwardRef<
      HTMLAnchorElement,
      React.AnchorHTMLAttributes<HTMLAnchorElement> & {destination: string}
    >(({destination, children, ...props}, ref) => (
      <a {...props} href={destination} ref={ref}>
        {children}
      </a>
    ))
    CustomLink.displayName = 'CustomLink'
    const originalRef = vi.fn()
    const updatedRef = vi.fn()
    const {rerender} = render(
      <ActionList>
        <ActionList.LinkItem as={CustomLink} destination="#home" ref={originalRef} _PrivateTooltipText="Go home">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )
    const link = screen.getByRole('link', {name: 'Home'})
    expect(originalRef).toHaveBeenLastCalledWith(link)

    rerender(
      <ActionList>
        <ActionList.LinkItem as={CustomLink} destination="#docs" ref={updatedRef} _PrivateTooltipText="Read docs">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(screen.getByRole('link', {name: 'Home'})).toBe(link)
    expect(link).toHaveAttribute('href', '#docs')
    expect(link).toHaveAccessibleDescription('Read docs')
    expect(originalRef).toHaveBeenLastCalledWith(null)
    expect(updatedRef).toHaveBeenLastCalledWith(link)
  })

  it('preserves an open tooltip across prop and layout updates and can reopen it at the new position', async () => {
    const renderItem = (tooltipText: string, offset: number) => (
      <div style={{paddingTop: offset}}>
        <ActionList>
          <ActionList.LinkItem href="#home" _PrivateTooltipText={tooltipText}>
            Home
          </ActionList.LinkItem>
        </ActionList>
      </div>
    )
    const {rerender} = render(renderItem('Go home', 0))
    const link = screen.getByRole('link', {name: 'Home'})
    const tooltip = screen.getByText('Go home')
    fireEvent.mouseOver(link)
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true))
    const originalLinkTop = link.getBoundingClientRect().top
    const originalTooltipTop = tooltip.getBoundingClientRect().top

    rerender(renderItem('Go docs', 0))

    expect(screen.getByText('Go docs')).toBe(tooltip)
    expect(tooltip.matches(':popover-open')).toBe(true)
    expect(link).toHaveAccessibleDescription('Go docs')
    expect(link).toHaveAttribute('aria-describedby', tooltip.id)

    rerender(renderItem('Go docs', 80))

    expect(screen.getByRole('link', {name: 'Home'})).toBe(link)
    expect(link.getBoundingClientRect().top - originalLinkTop).toBeCloseTo(80)
    expect(tooltip.matches(':popover-open')).toBe(true)
    fireEvent.mouseLeave(link)
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(false))
    fireEvent.mouseOver(link)
    await waitFor(() => expect(tooltip.matches(':popover-open')).toBe(true))
    expect(tooltip.getBoundingClientRect().top - originalTooltipTop).toBeCloseTo(80)
  })

  it('preserves child state and mount effects while allowing child props to update', () => {
    const onMount = vi.fn()
    const onUnmount = vi.fn()
    function StatefulChild({label}: {label: string}) {
      const [initialLabel] = React.useState(label)
      React.useEffect(() => {
        onMount()
        return onUnmount
      }, [])

      return (
        <span>
          {label}, initially {initialLabel}
        </span>
      )
    }
    const renderItem = (label: string) => (
      <ActionList>
        <ActionList.LinkItem href="#home" onClick={event => event.preventDefault()}>
          <StatefulChild label={label} />
        </ActionList.LinkItem>
      </ActionList>
    )
    const {rerender, unmount} = render(renderItem('Home'))
    const child = screen.getByText('Home, initially Home')
    expect(onMount).toHaveBeenCalledTimes(1)

    rerender(renderItem('Docs'))

    expect(screen.getByText('Docs, initially Home')).toBe(child)
    expect(onMount).toHaveBeenCalledTimes(1)
    expect(onUnmount).not.toHaveBeenCalled()
    unmount()
    expect(onUnmount).toHaveBeenCalledTimes(1)
  })

  it('updates inactive state and restores an active link', () => {
    const onClick = vi.fn()
    const renderItem = (inactiveText?: string) => (
      <ActionList>
        <ActionList.LinkItem href="#home" inactiveText={inactiveText} onClick={onClick}>
          Home
        </ActionList.LinkItem>
      </ActionList>
    )
    const {rerender} = render(renderItem())
    rerender(renderItem('Unavailable'))

    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    fireEvent.click(screen.getByText('Home'))
    expect(onClick).not.toHaveBeenCalled()

    rerender(renderItem())
    const link = screen.getByRole('link', {name: 'Home'})
    expect(link).toHaveAttribute('href', '#home')
    fireEvent.click(link)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

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

  it('forwards its ref to the link when wrapped in a tooltip', () => {
    const ref = React.createRef<HTMLAnchorElement>()

    render(
      <ActionList>
        <ActionList.LinkItem ref={ref} href="#home" _PrivateTooltipText="Go home">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(ref.current).toBe(screen.getByRole('link', {name: 'Home'}))
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
