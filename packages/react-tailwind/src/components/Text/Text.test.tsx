import React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {Text} from './Text'

describe('Text', () => {
  it('supports semantic composition and root props', () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(
      <Text as="p" ref={ref} data-testid="text">
        Copy
      </Text>,
    )
    expect(screen.getByTestId('text').tagName).toBe('P')
    expect(screen.getByTestId('text')).toBe(ref.current)
  })

  it('inherits typography when variants are omitted', () => {
    const {getByTestId} = render(<Text data-testid="inherited-text">Copy</Text>)

    expect(getByTestId('inherited-text')).not.toHaveClass(
      'primer:text-sm',
      'primer:font-normal',
      'primer:whitespace-normal',
    )
  })

  it('supports Primer whitespace values', () => {
    const {getByTestId} = render(
      <Text data-testid="whitespace-text" whiteSpace="pre-wrap">
        Copy
      </Text>,
    )

    expect(getByTestId('whitespace-text')).toHaveClass('primer:whitespace-pre-wrap')
  })

  it('preserves native label props, names, refs and click targets', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLLabelElement>()
    let clicked: HTMLLabelElement | undefined
    render(
      <>
        <Text
          as="label"
          htmlFor="key-title"
          ref={ref}
          weight="semibold"
          onClick={event => {
            clicked = event.currentTarget
          }}
        >
          Key title
        </Text>
        <input id="key-title" />
      </>,
    )
    const label = screen.getByText('Key title')
    expect(label).toBe(ref.current)
    expect(label).toHaveAttribute('for', 'key-title')
    expect(label).toHaveClass('primer:font-semibold')
    const input = screen.getByRole('textbox', {name: 'Key title'})
    await user.click(label)
    expect(input).toHaveFocus()
    expect(clicked).toBe(label)
  })

  it('preserves header-cell props, refs, event targets and typography', async () => {
    const user = userEvent.setup()
    const ref = React.createRef<HTMLTableCellElement>()
    let clicked: HTMLTableCellElement | undefined
    render(
      <table>
        <thead>
          <tr>
            <Text
              as="th"
              scope="col"
              colSpan={2}
              ref={ref}
              size="small"
              weight="medium"
              whiteSpace="nowrap"
              onClick={event => {
                clicked = event.currentTarget
              }}
            >
              Metric
            </Text>
          </tr>
        </thead>
      </table>,
    )
    const cell = screen.getByRole('columnheader', {name: 'Metric'})
    expect(cell).toBe(ref.current)
    expect(cell).toHaveAttribute('scope', 'col')
    expect(cell).toHaveAttribute('colspan', '2')
    expect(cell).toHaveClass('primer:text-xs', 'primer:font-medium', 'primer:whitespace-nowrap')
    await user.click(cell)
    expect(clicked).toBe(cell)
  })

  it('preserves custom-component props, refs and authored classes', () => {
    function RouterLink({to, children, ...props}: {to: string} & React.ComponentPropsWithRef<'a'>) {
      return (
        <a {...props} href={to}>
          {children}
        </a>
      )
    }
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <Text as={RouterLink} to="/metrics" ref={ref} weight="semibold" className="consumer-class">
        Metrics
      </Text>,
    )
    const link = screen.getByRole('link', {name: 'Metrics'})
    expect(link).toBe(ref.current)
    expect(link).toHaveAttribute('href', '/metrics')
    expect(link).toHaveClass('primer:font-semibold', 'consumer-class')
  })

  it('retains the default span and updates native refs when the element changes', () => {
    const spanRef = React.createRef<HTMLSpanElement>()
    const labelRef = React.createRef<HTMLLabelElement>()
    const {rerender} = render(<Text ref={spanRef}>Copy</Text>)
    expect(spanRef.current?.tagName).toBe('SPAN')
    rerender(
      <Text as="label" htmlFor="copy" ref={labelRef}>
        Copy
      </Text>,
    )
    expect(spanRef.current).toBeNull()
    expect(labelRef.current?.tagName).toBe('LABEL')
  })

  it('server-renders the native element and its attributes without changing typography defaults', () => {
    const markup = renderToString(
      <Text as="label" htmlFor="key-title">
        Key title
      </Text>,
    )
    expect(markup).toMatch(/^<label /)
    expect(markup).toContain('for="key-title"')
    expect(markup).toContain('data-component="Text"')
    expect(markup).not.toContain('font-normal')
    expect(markup).not.toContain('text-sm')
  })
})

function acceptsTextElement(_element: React.ReactElement) {}

acceptsTextElement(
  // @ts-expect-error A default span does not accept label-specific props.
  <Text htmlFor="key-title">Key title</Text>,
)
acceptsTextElement(
  // @ts-expect-error A label ref cannot refer to a table cell.
  <Text as="label" ref={React.createRef<HTMLTableCellElement>()}>
    Key title
  </Text>,
)
acceptsTextElement(
  // @ts-expect-error A header cell does not accept link props.
  <Text as="th" href="/metrics">
    Metric
  </Text>,
)
acceptsTextElement(
  // @ts-expect-error A non-default type argument requires the matching runtime element.
  <Text<'label'> htmlFor="key-title">Key title</Text>,
)
