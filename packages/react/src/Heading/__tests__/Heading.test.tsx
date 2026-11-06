import {describe, expect, it, vi} from 'vitest'
import Heading from '..'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import classes from '../Heading.module.css'
import {implementsClassName} from '../../utils/testing'

describe('Heading', () => {
  implementsClassName(Heading, classes.Heading)

  it('renders data-component attribute', async () => {
    render(<Heading />)
    await expect.element(page.getByRole('heading')).toHaveAttribute('data-component', 'Heading')
  })

  it('renders <h2> by default', () => {
    render(<Heading />)
    const heading = page.getByRole('heading').element()
    expect(heading.tagName).toBe('H2')
  })

  it('logs a warning when trying to render invalid "as" prop', () => {
    const consoleSpy = vi.spyOn(globalThis.console, 'warn').mockImplementation(() => {})

    // @ts-expect-error as prop should not be accepted
    render(<Heading as="i" />)
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  // How can we test for generated class names?
  it.todo('should only include css modules class', async () => {
    render(<Heading>test</Heading>)
    await expect.element(page.getByText('test', {exact: true})).toHaveClass('prc-Heading-Heading-6CmGO')
    // Note: this is the generated class name when CSS modules is used
    // for this component
    await expect.element(page.getByText('test', {exact: true})).not.toHaveClass(/^Heading__StyledHeading/)
  })
})
