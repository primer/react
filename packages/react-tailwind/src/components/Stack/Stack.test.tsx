import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Stack, StackItem} from './Stack'

describe('Stack', () => {
  it('forwards props and keeps authored children in order', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Stack ref={ref} data-testid="stack" direction={{narrow: 'vertical', regular: 'horizontal'}} gap="normal">
        <StackItem>First</StackItem>
        <StackItem>Second</StackItem>
      </Stack>,
    )
    expect(screen.getByTestId('stack')).toBe(ref.current)
    expect(screen.getByTestId('stack').textContent).toBe('FirstSecond')
    expect(screen.getByTestId('stack')).toHaveClass('primer:md:flex-row')
  })

  it('does not grow items unless grow is requested', () => {
    render(<StackItem data-testid="item">Item</StackItem>)
    expect(screen.getByTestId('item')).toHaveClass('primer:grow-0')
    expect(screen.getByTestId('item')).not.toHaveClass('primer:flex-auto')
  })

  it('uses normal spacing by default', () => {
    const {container} = render(<Stack>Content</Stack>)
    expect(container.firstElementChild).toHaveClass('primer:gap-4')
  })

  it('uses 2xl for the wide range and component defaults for omitted ranges', () => {
    const {container} = render(<Stack data-testid="stack" direction={{regular: 'horizontal'}} />)
    expect(container.querySelector('[data-testid="stack"]')).toHaveClass(
      'primer:flex-col',
      'primer:md:flex-row',
      'primer:2xl:flex-col',
    )
  })

  it('applies the full padding scale at every responsive range', () => {
    const {container} = render(<Stack padding={{narrow: 'tight', regular: 'normal', wide: 'spacious'}} />)
    expect(container.firstElementChild).toHaveClass('primer:p-1', 'primer:md:p-4', 'primer:2xl:p-6')
  })

  it.each([
    {name: 'Stack', Component: Stack},
    {name: 'Stack.Item', Component: Stack.Item},
    {name: 'StackItem', Component: StackItem},
  ])('preserves native form props, refs, change and submit events for $name', async ({Component}) => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLFormElement>()
    let changed: HTMLFormElement | undefined
    let submitted: FormData | undefined
    render(
      <Component
        as="form"
        aria-label="Key settings"
        ref={ref}
        action="/keys"
        method="post"
        encType="multipart/form-data"
        onChange={event => {
          changed = event.currentTarget
        }}
        onSubmit={event => {
          event.preventDefault()
          submitted = new FormData(event.currentTarget)
        }}
      >
        <input aria-label="Title" name="title" />
        <button type="submit">Save</button>
      </Component>,
    )
    const form = screen.getByRole('form', {name: 'Key settings'})
    expect(form).toBe(ref.current)
    expect(form).toHaveAttribute('action', '/keys')
    expect(form).toHaveAttribute('method', 'post')
    expect(form).toHaveAttribute('enctype', 'multipart/form-data')
    await user.type(screen.getByRole('textbox', {name: 'Title'}), 'Work key')
    expect(changed).toBe(form)
    await user.keyboard('{Enter}')
    expect(submitted?.get('title')).toBe('Work key')
  })

  it.each([Stack, StackItem])('forwards custom-component props and refs without adding a wrapper', Component => {
    function RouterLink({to, children, ...props}: {to: string} & React.ComponentPropsWithRef<'a'>) {
      return (
        <a {...props} href={to}>
          {children}
        </a>
      )
    }
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <Component as={RouterLink} to="/keys" ref={ref} className="consumer-class" target="_blank">
        Keys
      </Component>,
    )
    const link = screen.getByRole('link', {name: 'Keys'})
    expect(link).toBe(ref.current)
    expect(link).toHaveAttribute('href', '/keys')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveClass('primer:min-w-0', 'consumer-class')
  })

  it('updates the forwarded ref when the native element changes', () => {
    const divRef = React.createRef<HTMLDivElement>()
    const formRef = React.createRef<HTMLFormElement>()
    const {rerender} = render(<Stack ref={divRef} />)
    expect(divRef.current?.tagName).toBe('DIV')
    rerender(<Stack as="form" ref={formRef} />)
    expect(divRef.current).toBeNull()
    expect(formRef.current?.tagName).toBe('FORM')
  })

  it('server-renders the chosen element, form attributes, children and layout classes', () => {
    const markup = renderToString(
      <Stack as="form" action="/keys" method="post" direction="horizontal" gap="condensed">
        <Stack.Item as="fieldset" grow>
          <legend>Key settings</legend>
        </Stack.Item>
      </Stack>,
    )
    expect(markup).toMatch(/^<form /)
    expect(markup).toContain('action="/keys"')
    expect(markup).toContain('method="post"')
    expect(markup).toContain('flex-row')
    expect(markup).toContain('gap-2')
    expect(markup).toContain('data-component="StackItem"')
    expect(markup).toMatch(/<fieldset .*<legend>Key settings<\/legend><\/fieldset>/)
  })
})

function acceptsStackElement(_element: React.ReactElement) {}

acceptsStackElement(
  // @ts-expect-error A default div does not accept form-specific props.
  <Stack action="/keys" />,
)
acceptsStackElement(
  // @ts-expect-error A form ref cannot refer to a button.
  <Stack as="form" ref={React.createRef<HTMLButtonElement>()} />,
)
acceptsStackElement(
  // @ts-expect-error Explicit non-default type arguments still require a matching runtime element.
  <Stack<'form'> action="/keys" />,
)
acceptsStackElement(
  // @ts-expect-error Stack.Item has the same element-specific prop contract.
  <Stack.Item as="button" href="/keys" />,
)
