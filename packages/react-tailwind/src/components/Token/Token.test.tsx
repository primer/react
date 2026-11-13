import {act, fireEvent, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type {FormEvent} from 'react'
import React from 'react'
import {hydrateRoot} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {IssueLabelToken, Token, TokenBase} from './'

describe.each(['Token', 'IssueLabelToken', 'TokenBase'] as const)('%s default root', name => {
  it('renders an explicitly undefined root as a span and forwards its ref and props', () => {
    const ref = React.createRef<HTMLSpanElement>()
    const onClick = vi.fn()
    const commonProps = {as: undefined, 'data-testid': 'token-root', onClick, ref, text: 'Issues'}
    const token =
      name === 'Token' ? (
        <Token {...commonProps} />
      ) : name === 'IssueLabelToken' ? (
        <IssueLabelToken {...commonProps} />
      ) : (
        <TokenBase {...commonProps}>Issues</TokenBase>
      )
    render(token)

    const root = screen.getByTestId('token-root')
    expect(root.tagName).toBe('SPAN')
    expect(ref.current).toBe(root)
    fireEvent.click(root)
    expect(onClick).toHaveBeenCalledOnce()
  })
})

it('removes tokens with the remove button and keyboard', () => {
  const remove = vi.fn()
  render(<Token as="button" onRemove={remove} text="design" />)

  const token = screen.getByRole('button', {name: /design/})
  expect(token.querySelector('button')).not.toBeInTheDocument()
  expect(token.parentElement).toHaveAttribute('data-component', 'TokenBase')
  expect(token.parentElement).toHaveProperty('tagName', 'SPAN')
  fireEvent.keyDown(token, {key: 'Backspace'})
  expect(remove).toHaveBeenCalledTimes(1)
  const removeButton = token.parentElement?.querySelector<HTMLElement>('[data-component="Token.RemoveButton"]')
  if (!removeButton) throw new Error('Expected Token.RemoveButton')
  fireEvent.click(removeButton)
  expect(remove).toHaveBeenCalledTimes(2)
})

describe.each(['Token', 'IssueLabelToken'] as const)('%s remove button accessible name', name => {
  const Component = name === 'Token' ? Token : IssueLabelToken

  it('uses a supplied name for rich text and retains existing defaults', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    const richText = (
      <>
        <span className="sr-only">Open pull request </span>
        <span>#42</span>
      </>
    )
    const {rerender} = render(
      <Component
        data-testid="token-root"
        onRemove={onRemove}
        removeButtonLabel="Remove linked pull request #42"
        text={richText}
      />,
    )

    expect(screen.getByTestId('token-root')).not.toHaveAttribute('removeButtonLabel')
    await user.click(screen.getByRole('button', {name: 'Remove linked pull request #42'}))
    expect(onRemove).toHaveBeenCalledTimes(1)

    rerender(<Component onRemove={onRemove} text="bug" />)
    expect(screen.getByRole('button', {name: 'Remove bug'})).toBeInTheDocument()

    rerender(<Component onRemove={onRemove} text={richText} />)
    expect(screen.getByRole('button', {name: 'Remove token'})).toBeInTheDocument()

    rerender(<Component onRemove={onRemove} removeButtonLabel="Quitar bug" text="bug" />)
    expect(screen.getByRole('button', {name: 'Quitar bug'})).toBeInTheDocument()
  })

  it('does not forward the name when the remove button is hidden or absent', () => {
    const onRemove = vi.fn()
    const {rerender} = render(
      <Component
        data-testid="token-root"
        hideRemoveButton
        onRemove={onRemove}
        removeButtonLabel="Remove bug"
        text="bug"
      />,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByTestId('token-root')).not.toHaveAttribute('removeButtonLabel')

    rerender(<Component data-testid="token-root" removeButtonLabel="Remove bug" text="bug" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByTestId('token-root')).not.toHaveAttribute('removeButtonLabel')
  })

  it('keeps interactive removal pointer-only and preserves keyboard removal', () => {
    const onRemove = vi.fn()
    render(
      <Component
        as="a"
        data-testid="token-root"
        href="/pull/42"
        onRemove={onRemove}
        removeButtonLabel="Remove pull request #42"
        text="Pull request #42"
      />,
    )
    const root = screen.getByTestId('token-root')
    const action = screen.getByRole('link', {name: /Pull request #42/})
    const affordance = root.querySelector<HTMLElement>('[data-component="Token.RemoveButton"]')
    if (!affordance) throw new Error('Expected pointer removal affordance')

    expect(root).not.toHaveAttribute('removeButtonLabel')
    expect(affordance).toHaveAttribute('aria-hidden', 'true')
    expect(affordance).not.toHaveAttribute('aria-label')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    fireEvent.keyDown(action, {key: 'Backspace'})
    fireEvent.click(affordance)
    expect(onRemove).toHaveBeenCalledTimes(2)
  })

  it('preserves the supplied accessible name through server rendering and hydration', async () => {
    const app = (
      <Component onRemove={() => {}} removeButtonLabel="Remove pull request #42" text={<span>Pull request #42</span>} />
    )
    const markup = renderToString(app)
    expect(markup).toContain('aria-label="Remove pull request #42"')
    expect(markup).not.toContain('removeButtonLabel')

    const container = document.createElement('div')
    container.innerHTML = markup
    document.body.append(container)
    const button = screen.getByRole('button', {name: 'Remove pull request #42'})
    const onRecoverableError = vi.fn()
    let root: ReturnType<typeof hydrateRoot> | undefined
    try {
      await act(async () => {
        root = hydrateRoot(container, app, {onRecoverableError})
      })
      expect(screen.getByRole('button', {name: 'Remove pull request #42'})).toBe(button)
      expect(onRecoverableError).not.toHaveBeenCalled()
    } finally {
      await act(async () => root?.unmount())
      container.remove()
    }
  })
})

describe('TokenBase disabled semantics', () => {
  it.each(['span', 'a', 'button'] as const)('keeps native disabled separate from explicit ARIA on %s', as => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault())
    const {rerender} = render(<></>)
    for (const disabled of [false, true, false]) {
      for (const ariaDisabled of [true, 'true', false, 'false', undefined] as const) {
        rerender(
          <TokenBase
            as={as}
            {...(as === 'a' ? {href: '/details'} : {})}
            aria-disabled={ariaDisabled}
            data-testid="token-base"
            disabled={disabled}
            onClick={onClick}
            text="Details"
          >
            Details
          </TokenBase>,
        )
        const root = screen.getByTestId('token-base')
        const expectedAria = as !== 'button' && disabled ? true : ariaDisabled
        if (expectedAria === undefined) expect(root).not.toHaveAttribute('aria-disabled')
        else expect(root).toHaveAttribute('aria-disabled', String(expectedAria))
        if (as === 'button' && disabled) expect(root).toHaveAttribute('disabled')
        else expect(root).not.toHaveAttribute('disabled')
        onClick.mockClear()
        fireEvent.click(root)
        expect(onClick).toHaveBeenCalledTimes(disabled ? 0 : 1)
      }
    }
  })
})

describe.each(['Token', 'IssueLabelToken'] as const)('%s native action props and root refs', name => {
  const Component = name === 'Token' ? Token : IssueLabelToken

  it.each([false, true])('keeps an aria-disabled button keyboard-activatable (removable: %s)', async removable => {
    const user = userEvent.setup()
    const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault())
    const ref = React.createRef<HTMLElement>()
    render(
      <Component
        as="button"
        aria-disabled
        data-testid="token-root"
        text="Details"
        onClick={onClick}
        onRemove={removable ? vi.fn() : undefined}
        ref={ref}
      />,
    )
    const root = screen.getByTestId('token-root')
    const action = screen.getByRole('button', {name: /Details/})
    expect(root).toBe(ref.current)
    expect(root).toHaveAttribute('aria-disabled', 'true')
    expect(action).not.toHaveAttribute('disabled')
    action.focus()
    expect(action).toHaveFocus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it.each(['span', 'a', 'button'] as const)(
    'preserves explicit aria-disabled on the %s root across removal changes',
    as => {
      const ref = React.createRef<HTMLElement>()
      const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault())
      const onRemove = vi.fn()
      const {rerender} = render(<></>)

      for (const ariaDisabled of [true, 'true', false, 'false', undefined] as const) {
        for (const [remove, hidden] of [
          [undefined, undefined],
          [onRemove, false],
          [onRemove, true],
          [undefined, false],
        ] as const) {
          rerender(
            <Component
              as={as}
              {...(as === 'a' ? {href: '/details'} : {})}
              aria-disabled={ariaDisabled}
              data-testid="token-root"
              onClick={as === 'span' ? undefined : onClick}
              onRemove={remove}
              hideRemoveButton={hidden}
              ref={ref}
              text="Details"
            />,
          )
          const root = screen.getByTestId('token-root')
          const split = as !== 'span' && Boolean(remove && !hidden)
          const action = split ? root.querySelector<HTMLElement>(as) : root
          if (!action) throw new Error('Expected token action')
          expect(root).toBe(ref.current)
          expect(root.tagName).toBe(split ? 'SPAN' : as.toUpperCase())
          if (ariaDisabled === undefined) expect(root).not.toHaveAttribute('aria-disabled')
          else expect(root).toHaveAttribute('aria-disabled', String(ariaDisabled))
          expect(action).not.toHaveAttribute('disabled')
          if (split) expect(action).not.toHaveAttribute('aria-disabled')
          if (as !== 'span') {
            action.focus()
            expect(action).toHaveFocus()
            onClick.mockClear()
            fireEvent.click(action)
            expect(onClick).toHaveBeenCalledTimes(1)
          }
        }
      }
    },
  )

  it('preserves aria-disabled for custom button roots without suppressing activation', () => {
    const CustomButton = React.forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'>>((props, ref) => (
      <button type="button" {...props} ref={ref} />
    ))
    const ref = React.createRef<HTMLElement>()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    const {rerender} = render(<></>)
    for (const hideRemoveButton of [true, false, true]) {
      rerender(
        <Component
          as={CustomButton}
          aria-disabled="true"
          data-testid="token-root"
          onClick={onClick}
          onRemove={onRemove}
          hideRemoveButton={hideRemoveButton}
          ref={ref}
          text="Details"
        />,
      )
      const root = screen.getByTestId('token-root')
      const action = root.matches('button') ? root : root.querySelector('button')
      if (!action) throw new Error('Expected custom button')
      expect(root).toBe(ref.current)
      expect(root).toHaveAttribute('aria-disabled', 'true')
      expect(action).not.toHaveAttribute('disabled')
      action.focus()
      expect(action).toHaveFocus()
      onClick.mockClear()
      fireEvent.click(action)
      expect(onClick).toHaveBeenCalledTimes(1)
    }
  })

  it.each([false, true])('routes anchor attributes without changing shell props (StrictMode: %s)', strict => {
    const ref = React.createRef<HTMLElement>()
    const onRemove = vi.fn()
    const fixture = (remove?: () => void, hidden?: boolean) => {
      const token = (
        <Component
          as="a"
          href="/issues"
          target="_blank"
          rel="noopener noreferrer"
          download="issues.csv"
          hrefLang="en"
          media="screen"
          ping="/audit"
          referrerPolicy="no-referrer"
          type="text/html"
          id="issue-token"
          data-testid="shell"
          aria-label="Issues"
          title="Issue filters"
          lang="en"
          className="consumer-class"
          ref={ref}
          text="Issues"
          onRemove={remove}
          hideRemoveButton={hidden}
        />
      )
      return strict ? <React.StrictMode>{token}</React.StrictMode> : token
    }
    const {rerender, unmount} = render(fixture())
    for (const [remove, hidden] of [
      [undefined, undefined],
      [onRemove, false],
      [onRemove, true],
      [onRemove, false],
      [undefined, false],
    ] as const) {
      rerender(fixture(remove, hidden))
      const root = screen.getByTestId('shell')
      const anchor = root.matches('a') ? root : root.querySelector('a')
      const split = Boolean(remove && !hidden)
      expect(root).toBe(ref.current)
      expect(root.tagName).toBe(split ? 'SPAN' : 'A')
      expect(root).toHaveAttribute('id', 'issue-token')
      expect(root).toHaveAttribute('aria-label', 'Issues')
      expect(root).toHaveAttribute('title', 'Issue filters')
      expect(root).toHaveAttribute('lang', 'en')
      expect(root).toHaveClass('consumer-class')
      for (const [attribute, value] of Object.entries({
        href: '/issues',
        target: '_blank',
        rel: 'noopener noreferrer',
        download: 'issues.csv',
        hreflang: 'en',
        media: 'screen',
        ping: '/audit',
        referrerpolicy: 'no-referrer',
        type: 'text/html',
      })) {
        expect(anchor).toHaveAttribute(attribute, value)
        if (split) expect(root).not.toHaveAttribute(attribute)
      }
    }
    unmount()
    expect(ref.current).toBeNull()
  })

  it('routes native button form attributes to the action, not the removable shell', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())
    const onClick = vi.fn()
    const onRemove = vi.fn()
    render(
      <>
        <form id="filters" onSubmit={onSubmit} />
        <Component
          as="button"
          type="submit"
          name="filter"
          value="issues"
          form="filters"
          formAction="/apply"
          formEncType="multipart/form-data"
          formMethod="post"
          formNoValidate
          formTarget="_blank"
          popoverTarget="details"
          popoverTargetAction="show"
          ref={ref}
          data-testid="shell"
          onClick={onClick}
          onRemove={onRemove}
          text="Apply"
        />
      </>,
    )
    const button = screen.getByRole('button', {name: /Apply/})
    const root = screen.getByTestId('shell')
    expect(root.tagName).toBe('SPAN')
    expect(root).toBe(ref.current)
    for (const [attribute, value] of Object.entries({
      name: 'filter',
      value: 'issues',
      form: 'filters',
      formaction: '/apply',
      formenctype: 'multipart/form-data',
      formmethod: 'post',
      formtarget: '_blank',
      popovertarget: 'details',
      popovertargetaction: 'show',
      type: 'submit',
    })) {
      expect(button).toHaveAttribute(attribute, value)
      expect(root).not.toHaveAttribute(attribute)
    }
    expect(button).toHaveAttribute('formnovalidate')
    expect(root).not.toHaveAttribute('formnovalidate')
    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
    expect(onSubmit).toHaveBeenCalledOnce()
    await user.tab()
    button.focus()
    await user.keyboard('{Delete}')
    expect(onRemove).toHaveBeenCalledOnce()
  })

  it('keeps custom router props on the action and refs and global props on the root', async () => {
    function RouterLink({
      to,
      preload,
      reloadDocument,
      children,
      ...props
    }: {
      to: string
      preload: 'intent'
      reloadDocument?: boolean
    } & React.ComponentPropsWithRef<'a'>) {
      return (
        <a {...props} href={to} data-preload={preload} data-reload={reloadDocument}>
          {children}
        </a>
      )
    }
    const user = userEvent.setup()
    const ref = React.createRef<HTMLElement>()
    const onClick = vi.fn()
    const onRemove = vi.fn()
    const fixture = (remove?: () => void, hidden?: boolean) => (
      <Component
        as={RouterLink}
        to="/issues"
        preload="intent"
        reloadDocument
        target="_blank"
        rel="noreferrer"
        ref={ref}
        id="custom-token"
        data-testid="shell"
        className="consumer-class"
        lang="en"
        itemProp="keywords"
        title="Issue filters"
        onClick={onClick}
        onRemove={remove}
        hideRemoveButton={hidden}
        text="Issues"
      />
    )
    const {rerender} = render(fixture())
    for (const [remove, hidden] of [
      [undefined, false],
      [onRemove, false],
      [onRemove, true],
    ] as const) {
      rerender(fixture(remove, hidden))
      const root = screen.getByTestId('shell')
      const anchor = screen.getByRole('link', {name: /Issues/})
      expect(root).toBe(ref.current)
      expect(root.tagName).toBe(remove && !hidden ? 'SPAN' : 'A')
      expect(anchor).toHaveAttribute('href', '/issues')
      expect(anchor).toHaveAttribute('target', '_blank')
      expect(anchor).toHaveAttribute('rel', 'noreferrer')
      expect(anchor).toHaveAttribute('data-preload', 'intent')
      expect(anchor).toHaveAttribute('data-reload', 'true')
      expect(root).not.toHaveAttribute('to')
      expect(root).not.toHaveAttribute('reloadDocument')
      expect(root).toHaveAttribute('itemprop', 'keywords')
      expect(root).toHaveAttribute('lang', 'en')
      await user.click(anchor)
    }
    expect(onClick).toHaveBeenCalledTimes(3)
    expect(onRemove).not.toHaveBeenCalled()
  })

  it('server-renders removable links with native attributes on the link', () => {
    const markup = renderToString(
      <Component as="a" href="/issues" target="_blank" rel="noreferrer" onRemove={() => {}} text="Issues" />,
    )
    const container = document.createElement('div')
    container.innerHTML = markup
    expect(container.firstElementChild?.tagName).toBe('SPAN')
    expect(container.firstElementChild).not.toHaveAttribute('target')
    expect(container.querySelector('a')).toHaveAttribute('target', '_blank')
    expect(container.querySelector('a')).toHaveAttribute('rel', 'noreferrer')
  })

  it('preserves custom button props, disabled state and callback root refs as removal changes', async () => {
    function CustomButton({
      command,
      type = 'button',
      ...props
    }: {command: string} & React.ComponentPropsWithRef<'button'>) {
      return (
        <button
          {...props}
          type={type === 'submit' ? 'submit' : type === 'reset' ? 'reset' : 'button'}
          data-command={command}
        />
      )
    }
    const user = userEvent.setup()
    const nodes: (HTMLElement | null)[] = []
    const ref = (node: HTMLElement | null) => {
      nodes.push(node)
    }
    const onRemove = vi.fn()
    const onClick = vi.fn()
    const fixture = (remove?: () => void, hidden?: boolean, disabled?: boolean) => (
      <Component
        as={CustomButton}
        command="apply-filter"
        name="filter"
        value="issues"
        type="button"
        onRemove={remove}
        hideRemoveButton={hidden}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        text="Apply"
        data-testid="shell"
      />
    )
    const {rerender, unmount} = render(fixture())
    for (const [remove, hidden, disabled] of [
      [undefined, false, false],
      [onRemove, false, false],
      [onRemove, true, false],
      [onRemove, false, true],
      [onRemove, false, false],
      [undefined, false, false],
    ] as const) {
      rerender(fixture(remove, hidden, disabled))
      const root = screen.getByTestId('shell')
      const button = screen.getByRole('button', {name: /Apply/})
      expect(root.tagName).toBe(remove && !hidden ? 'SPAN' : 'BUTTON')
      expect(nodes.at(-1)).toBe(root)
      expect(button).toHaveAttribute('name', 'filter')
      expect(button).toHaveAttribute('value', 'issues')
      expect(button).toHaveAttribute('data-command', 'apply-filter')
      if (disabled) {
        expect(button).toBeDisabled()
      } else {
        await user.click(button)
      }
      if (root !== button) {
        expect(root).not.toHaveAttribute('name')
        expect(root).not.toHaveAttribute('value')
        expect(root).not.toHaveAttribute('command')
      }
    }
    expect(onClick).toHaveBeenCalledTimes(5)
    expect(onRemove).not.toHaveBeenCalled()
    unmount()
    expect(nodes.at(-1)).toBeNull()
  })
})

it('TokenBase preserves its selected native or custom root ref without a removable wrapper', () => {
  const ref = React.createRef<HTMLAnchorElement>()
  const {rerender} = render(
    <TokenBase as="a" href="/issues" target="_blank" rel="noreferrer" ref={ref} text="Issues" onRemove={() => {}}>
      Issues
    </TokenBase>,
  )
  expect(screen.getByRole('link')).toBe(ref.current)
  expect(ref.current).toHaveAttribute('target', '_blank')
  function RouterLink({to, children, ...props}: {to: string} & React.ComponentPropsWithRef<'a'>) {
    return (
      <a {...props} href={to}>
        {children}
      </a>
    )
  }
  rerender(
    <TokenBase as={RouterLink} to="/labels" target="_blank" ref={ref} text="Labels">
      Labels
    </TokenBase>,
  )
  expect(screen.getByRole('link', {name: 'Labels'})).toBe(ref.current)
  expect(ref.current).toHaveAttribute('href', '/labels')
})

function acceptsTokenElement(_element: React.ReactElement) {}
function RouterTokenLink({to, children, ...props}: {to: string} & React.ComponentPropsWithRef<'a'>) {
  return (
    <a {...props} href={to}>
      {children}
    </a>
  )
}

acceptsTokenElement(<Token as="a" target="_blank" download="issues.csv" text="Issues" />)
acceptsTokenElement(<Token as="button" form="filters" name="filter" value="issues" text="Issues" />)
acceptsTokenElement(<Token as={RouterTokenLink} to="/issues" text="Issues" ref={React.createRef<HTMLElement>()} />)
acceptsTokenElement(
  <TokenBase as={RouterTokenLink} to="/issues" text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error Router roots retain their required props.
  <Token as={RouterTokenLink} text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error Native anchors do not accept button-only form props.
  <Token as="a" form="filters" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error Native buttons do not accept anchor-only target props.
  <IssueLabelToken as="button" target="_blank" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error Native buttons do not accept anchor-only href props.
  <Token as="button" href="/issues" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error Native buttons retain their restricted type values.
  <Token as="button" type="text/html" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error Default spans do not accept anchor-only target props.
  <Token target="_blank" text="Issues" />,
)
acceptsTokenElement(<Token as={undefined} text="Issues" ref={React.createRef<HTMLSpanElement>()} />)
acceptsTokenElement(<IssueLabelToken as={undefined} text="Issues" ref={React.createRef<HTMLSpanElement>()} />)
acceptsTokenElement(
  <Token
    as={undefined}
    text="Issues"
    data-testid="token"
    onClick={event => event.currentTarget.focus()}
    ref={React.createRef<HTMLSpanElement>()}
  />,
)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined root is a span and does not accept anchor-only props.
  <Token as={undefined} target="_blank" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined root cannot be stored in an anchor-only ref.
  <Token as={undefined} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined issue token root cannot be stored in an anchor-only ref.
  <IssueLabelToken as={undefined} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined root is a span and does not accept button-only props.
  <Token as={undefined} form="filters" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined root is a span and does not accept anchor-only props.
  <IssueLabelToken as={undefined} href="/labels" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error An explicit span does not accept anchor-only props.
  <IssueLabelToken as="span" target="_blank" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error A concrete span root must not receive an anchor-only ref.
  <Token as="span" text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error TokenBase must not store a concrete span in an anchor-only ref.
  <TokenBase as="span" text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(<TokenBase as={undefined} text="Issues" ref={React.createRef<HTMLSpanElement>()} />)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined TokenBase root is also a span.
  <TokenBase as={undefined} target="_blank" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error An explicitly undefined TokenBase root cannot be stored in an anchor-only ref.
  <TokenBase as={undefined} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
const undefinedAnchorProps = {as: undefined, text: 'Issues', target: '_blank'}
acceptsTokenElement(
  // @ts-expect-error Spreading an explicitly undefined root must not admit anchor-only props.
  <Token {...undefinedAnchorProps} />,
)
acceptsTokenElement(
  // @ts-expect-error The same span-root check applies to TokenBase spreads.
  <TokenBase {...undefinedAnchorProps} />,
)
const maybeAnchor: 'a' | undefined = Math.random() > 0.5 ? 'a' : undefined
acceptsTokenElement(<Token as={maybeAnchor} text="Issues" ref={React.createRef<HTMLElement>()} />)
acceptsTokenElement(<IssueLabelToken as={maybeAnchor} text="Issues" ref={React.createRef<HTMLElement>()} />)
acceptsTokenElement(<TokenBase as={maybeAnchor} text="Issues" ref={React.createRef<HTMLElement>()} />)
const optionalRootRef = React.createRef<HTMLAnchorElement | HTMLSpanElement>()
acceptsTokenElement(<Token as={maybeAnchor} text="Issues" ref={optionalRootRef} />)
acceptsTokenElement(<TokenBase as={maybeAnchor} text="Issues" ref={optionalRootRef} />)
acceptsTokenElement(
  // @ts-expect-error An optional anchor root can still point at a span.
  <Token as={maybeAnchor} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error An optional TokenBase anchor root can also be a span.
  <TokenBase as={maybeAnchor} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error An optional anchor root can still be a span.
  <Token as={maybeAnchor} href="/issues" text="Issues" />,
)
function acceptsBroadRoot(as: NonNullable<React.ComponentProps<typeof Token>['as']>) {
  acceptsTokenElement(<Token as={as} text="Issues" ref={React.createRef<HTMLElement>()} />)
  acceptsTokenElement(
    // @ts-expect-error A broad root must not receive an anchor-only ref.
    <Token as={as} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
  )
}
void acceptsBroadRoot
const reflectedDefaultBase: React.ComponentProps<typeof TokenBase> = {text: 'Issues'}
const reflectedAnchorBase: React.ComponentProps<typeof TokenBase> = {as: 'a', href: '/issues', text: 'Issues'}
function ReflectedTokenBase(props: React.ComponentProps<typeof TokenBase>) {
  return <TokenBase {...props} />
}
acceptsTokenElement(<ReflectedTokenBase {...reflectedDefaultBase} />)
acceptsTokenElement(<ReflectedTokenBase {...reflectedAnchorBase} />)
acceptsTokenElement(<TokenBase as="a" text="Issues" ref={React.createRef<HTMLAnchorElement>()} />)
acceptsTokenElement(
  // @ts-expect-error TokenBase refs follow their actual root rather than a different native element.
  <TokenBase as="a" text="Issues" ref={React.createRef<HTMLButtonElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error Native token roots retain the span, anchor and button choices.
  <Token as="div" text="Issues" />,
)
acceptsTokenElement(
  // @ts-expect-error The configurable compound token ref must also accept its span shell.
  <Token as="a" onRemove={() => {}} text="Issues" ref={React.createRef<HTMLAnchorElement>()} />,
)
acceptsTokenElement(
  // @ts-expect-error Anchor-only callback refs cannot receive the removable span shell.
  <IssueLabelToken as="a" text="Issues" onRemove={() => {}} ref={(_element: HTMLAnchorElement | null) => {}} />,
)
function acceptsDynamicToken(remove?: () => void, hidden?: boolean) {
  acceptsTokenElement(
    <Token as="a" text="Issues" onRemove={remove} hideRemoveButton={hidden} ref={React.createRef<HTMLElement>()} />,
  )
  const narrowRef = React.createRef<HTMLAnchorElement>()
  acceptsTokenElement(
    // @ts-expect-error Dynamic removal props do not guarantee an anchor root.
    <Token as="a" text="Issues" onRemove={remove} hideRemoveButton={hidden} ref={narrowRef} />,
  )
}
void acceptsDynamicToken

acceptsTokenElement(
  <Token
    as="a"
    text="Issues"
    ref={element => {
      element?.focus()
      // @ts-expect-error A compound token callback must handle the span shell, not only an anchor.
      element?.href
    }}
  />,
)
it('sets the custom issue-label color variables', () => {
  render(<IssueLabelToken data-testid="label" fillColor="#ffffff" text="bug" />)
  expect(screen.getByTestId('label').getAttribute('style')).toContain(
    '--issue-label-light-background: rgb(255 255 255)',
  )
})

describe.each(['Token', 'IssueLabelToken', 'TokenBase'] as const)('%s button form behavior', name => {
  it.each([false, true])('defaults to button and supports submit and reset (removable: %s)', async removable => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault())
    const onRemove = removable ? () => {} : undefined
    const form = (type?: 'button' | 'reset' | 'submit') => (
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input defaultValue="original" />
        </label>
        {name === 'Token' ? (
          <Token as="button" onRemove={onRemove} text="Design" type={type} />
        ) : name === 'IssueLabelToken' ? (
          <IssueLabelToken as="button" onRemove={onRemove} text="Design" type={type} />
        ) : (
          <TokenBase as="button" onRemove={onRemove} text="Design" type={type}>
            Design
          </TokenBase>
        )}
      </form>
    )
    const {rerender} = render(form())
    const button = screen.getByRole('button', {name: /Design/})
    expect(button).toHaveAttribute('type', 'button')
    await user.click(button)
    expect(onSubmit).not.toHaveBeenCalled()

    rerender(form('submit'))
    expect(button).toHaveAttribute('type', 'submit')
    await user.click(button)
    expect(onSubmit).toHaveBeenCalledOnce()

    rerender(form('reset'))
    const input = screen.getByRole('textbox', {name: 'Name'})
    await user.clear(input)
    await user.type(input, 'changed')
    expect(button).toHaveAttribute('type', 'reset')
    await user.click(button)
    expect(input).toHaveValue('original')
    expect(onSubmit).toHaveBeenCalledOnce()
  })
})
