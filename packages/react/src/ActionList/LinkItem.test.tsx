import {page, userEvent} from 'vitest/browser'
import {describe, it, expect, vi} from 'vitest'
import {act, render} from '@testing-library/react'
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
    const link = page.getByRole('link', {name: 'Home', exact: true}).element()
    const child = page.getByTestId('animated-child').element()
    act(() => link.focus())
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

    expect(page.getByRole('link', {name: 'Home', exact: true}).element()).toBe(link)
    expect(page.getByTestId('animated-child').element()).toBe(child)
    expect(link).toHaveFocus()
    expect(child.getAnimations()[0]).toBe(animation)
    expect(animation.startTime).toBe(startTime)
  })

  it('updates link props and handlers without replacing the link', async () => {
    const originalClick = vi.fn()
    const updatedClick = vi.fn()
    const {rerender} = render(
      <ActionList>
        <ActionList.LinkItem href="#home" onClick={originalClick}>
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )
    const link = page.getByRole('link', {name: 'Home', exact: true}).element()
    await userEvent.click(page.getByRole('link', {name: 'Home', exact: true}))

    rerender(
      <ActionList>
        <ActionList.LinkItem href="#docs" onClick={updatedClick}>
          Docs
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(page.getByRole('link', {name: 'Docs', exact: true}).element()).toBe(link)
    expect(link).toHaveAttribute('href', '#docs')
    await userEvent.click(page.getByRole('link', {name: 'Docs', exact: true}))
    expect(originalClick).toHaveBeenCalledTimes(1)
    expect(updatedClick).toHaveBeenCalledTimes(1)
  })

  it('keeps multiple items isolated and updates their children', async () => {
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
    const first = page.getByRole('link', {name: 'First', exact: true}).element()
    const second = page.getByRole('link', {name: 'Second completed', exact: true}).element()
    act(() => first.focus())
    rerender(renderItems(true))

    expect(page.getByRole('link', {name: 'First', exact: true}).element()).toBe(first)
    expect(page.getByRole('link', {name: 'Second working', exact: true}).element()).toBe(second)
    expect(first).toHaveFocus()
    expect(first).toHaveAttribute('href', '#first')
    expect(second).toHaveAttribute('href', '#second')
    await userEvent.click(page.getByRole('link', {name: 'First', exact: true}))
    expect(firstClick).toHaveBeenCalledTimes(1)
    expect(secondClick).not.toHaveBeenCalled()
    await userEvent.click(page.getByRole('link', {name: 'Second working', exact: true}))
    expect(secondClick).toHaveBeenCalledTimes(1)
  })

  it('calls the item handler before the consumer click handler', async () => {
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

    await userEvent.click(page.getByRole('link', {name: 'Home', exact: true}))
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
    const link = page.getByRole('link', {name: 'Home', exact: true}).element()
    expect(originalRef).toHaveBeenLastCalledWith(link)

    rerender(
      <ActionList>
        <ActionList.LinkItem as={CustomLink} destination="#docs" ref={updatedRef} _PrivateTooltipText="Read docs">
          Home
        </ActionList.LinkItem>
      </ActionList>,
    )

    expect(page.getByRole('link', {name: 'Home', exact: true}).element()).toBe(link)
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
    const link = page.getByRole('link', {name: 'Home', exact: true}).element()
    const tooltip = page.getByText('Go home', {exact: true}).element()
    const browserLink = page.getByRole('link', {name: 'Home'})
    await browserLink.hover()
    await expect.poll(() => tooltip.matches(':popover-open')).toBe(true)
    const originalLinkTop = link.getBoundingClientRect().top
    const originalTooltipTop = tooltip.getBoundingClientRect().top

    rerender(renderItem('Go docs', 0))

    expect(page.getByText('Go docs', {exact: true}).element()).toBe(tooltip)
    expect(tooltip.matches(':popover-open')).toBe(true)
    expect(link).toHaveAccessibleDescription('Go docs')
    expect(link).toHaveAttribute('aria-describedby', tooltip.id)

    rerender(renderItem('Go docs', 80))

    expect(page.getByRole('link', {name: 'Home', exact: true}).element()).toBe(link)
    expect(link.getBoundingClientRect().top - originalLinkTop).toBeCloseTo(80)
    expect(tooltip.matches(':popover-open')).toBe(true)
    await browserLink.unhover()
    await expect.poll(() => tooltip.matches(':popover-open')).toBe(false)
    await browserLink.hover()
    await expect.poll(() => tooltip.matches(':popover-open')).toBe(true)
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
    const child = page.getByText('Home, initially Home', {exact: true}).element()
    expect(onMount).toHaveBeenCalledTimes(1)

    rerender(renderItem('Docs'))

    expect(page.getByText('Docs, initially Home', {exact: true}).element()).toBe(child)
    expect(onMount).toHaveBeenCalledTimes(1)
    expect(onUnmount).not.toHaveBeenCalled()
    unmount()
    expect(onUnmount).toHaveBeenCalledTimes(1)
  })

  it('updates inactive state and restores an active link', async () => {
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

    expect(page.getByRole('link', {name: 'Home', exact: true}).elements()).toHaveLength(0)
    await userEvent.click(page.getByText('Home', {exact: true}))
    expect(onClick).not.toHaveBeenCalled()

    rerender(renderItem())
    const link = page.getByRole('link', {name: 'Home', exact: true}).element()
    expect(link).toHaveAttribute('href', '#home')
    await userEvent.click(page.getByRole('link', {name: 'Home', exact: true}))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

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
