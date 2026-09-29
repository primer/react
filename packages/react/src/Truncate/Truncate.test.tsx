import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import Truncate from '../Truncate'
import Link from '../Link'
import {implementsClassName} from '../utils/testing'
import classes from './Truncate.module.css'

describe('Truncate', () => {
  implementsClassName(Truncate, classes.Truncate)

  it('renders a <div> by default', () => {
    const {container} = render(<Truncate title="a-long-branch-name" />)
    expect(container.firstChild?.nodeName).toEqual('DIV')
  })

  it('respects the maxWidth prop', () => {
    const {container} = render(<Truncate maxWidth={250} title="a-long-branch-name" />)
    expect(container.firstChild).toHaveStyle('max-width: 250px')
  })

  it('respects the inline prop', () => {
    const {container} = render(<Truncate inline title="a-long-branch-name" />)
    expect(container.firstChild).toHaveStyle('display: inline-block')
  })

  it('passes the inline prop through to the `as` component', () => {
    const {container} = render(
      <Truncate as={Link} href="https://example.com" title="https://example.com" maxWidth={600} inline>
        https://example.com
      </Truncate>,
    )
    const link = container.firstChild as HTMLElement
    expect(link.nodeName).toEqual('A')
    expect(link).toHaveAttribute('data-inline', 'true')
    expect(link).toHaveAttribute('data-component', 'Link')
    expect(link).toHaveStyle('display: inline-block')
  })

  it('forwards the inline prop to custom `as` components', () => {
    const Custom = ({inline, ...props}: {inline?: boolean} & React.HTMLAttributes<HTMLElement>) => (
      <span {...props} data-received-inline={String(inline)} />
    )
    const {container} = render(<Truncate as={Custom} inline title="a-long-branch-name" />)
    expect(container.firstChild).toHaveAttribute('data-received-inline', 'true')
  })

  it('does not pass the inline prop to DOM elements', () => {
    const {container} = render(<Truncate as="span" inline title="a-long-branch-name" />)
    expect(container.firstChild).not.toHaveAttribute('inline')
  })
})
