import React from 'react'
import type {SpinnerProps} from '..'
import {Spinner} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('Spinner', () => {
  behavesAsComponent({
    Component: Spinner,
  })

  checkExports('Spinner', {
    default: Spinner,
  })

  it('should render an ARIA live region with default loading text', async () => {
    const {getByRole} = HTMLRender(<Spinner />)

    expect(getByRole('status').textContent).toBe('Loading')
  })

  it('should render an ARIA live region with custom loading text', async () => {
    const {getByRole} = HTMLRender(<Spinner srText="Custom loading text" />)

    expect(getByRole('status').textContent).toBe('Custom loading text')
  })

  it('should not render an ARIA live region with loading text when `srText` is set to `null`', async () => {
    const {queryByRole} = HTMLRender(<Spinner srText={null} />)

    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Spinner />)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
  })

  it('should respect size arguments', () => {
    const expectSize = (input: SpinnerProps['size'] | undefined, expectedSize: string) => {
      const {container} = HTMLRender(<Spinner size={input} />)
      const svg = container.querySelector('svg')!
      expect(svg.getAttribute('height')).toEqual(expectedSize)
      expect(svg.getAttribute('width')).toEqual(expectedSize)
    }

    // default: medium
    expectSize(undefined, '32px')
    expectSize('small', '16px')
    expectSize('medium', '32px')
    expectSize('large', '64px')
  })
})
