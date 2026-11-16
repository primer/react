import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import Truncate from '../Truncate'
import Link from '../Link'
import {implementsClassName} from '../utils/testing'
import classes from './Truncate.module.css'

describe('Truncate', () => {
  implementsClassName(Truncate, classes.Truncate)

  it('renders a <div> by default', () => {
    render(<Truncate title="a-long-branch-name" />)
    expect(page.getByTitle('a-long-branch-name').element().nodeName).toEqual('DIV')
  })

  it('respects the maxWidth prop', async () => {
    render(<Truncate maxWidth={250} title="a-long-branch-name" />)
    await expect.element(page.getByTitle('a-long-branch-name')).toHaveStyle('max-width: 250px')
  })

  it('respects the inline prop', async () => {
    render(<Truncate inline title="a-long-branch-name" />)
    await expect.element(page.getByTitle('a-long-branch-name')).toHaveStyle('display: inline-block')
  })

  it('passes the inline prop through to the `as` component', async () => {
    render(
      <Truncate as={Link} href="https://example.com" title="https://example.com" maxWidth={600} inline>
        https://example.com
      </Truncate>,
    )
    const link = page.getByRole('link', {name: 'https://example.com', exact: true})
    expect(link.element().nodeName).toEqual('A')
    await expect.element(link).toHaveAttribute('data-inline', 'true')
    await expect.element(link).toHaveAttribute('data-component', 'Link')
    await expect.element(link).toHaveStyle('display: inline-block')
  })

  it('forwards the inline prop to custom `as` components', async () => {
    const Custom = ({inline, ...props}: {inline?: boolean} & React.HTMLAttributes<HTMLElement>) => (
      <span {...props} data-received-inline={String(inline)} />
    )
    render(<Truncate as={Custom} inline title="a-long-branch-name" />)
    await expect.element(page.getByTitle('a-long-branch-name')).toHaveAttribute('data-received-inline', 'true')
  })

  it('does not pass the inline prop to DOM elements', async () => {
    render(<Truncate as="span" inline title="a-long-branch-name" />)
    await expect.element(page.getByTitle('a-long-branch-name')).not.toHaveAttribute('inline')
  })
})
