import React from 'react'
import axe from 'axe-core'
import type {SpinnerProps} from '..'
import {Spinner} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender, screen} from '@testing-library/react'

describe('Spinner', () => {
  behavesAsComponent({
    Component: Spinner,
  })

  checkExports('Spinner', {
    default: Spinner,
  })

  it('should label the spinner with default loading text', async () => {
    const {getByLabelText} = HTMLRender(<Spinner />)

    expect(getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should label the spinner with with custom loading text', async () => {
    const {getByLabelText} = HTMLRender(<Spinner srText="Custom loading text" />)

    expect(getByLabelText('Custom loading text')).toBeInTheDocument()
  })

  it('should not label the spinner with with loading text when `srText` is set to `null`', () => {
    const {getByLabelText} = HTMLRender(<Spinner srText={null} />)

    expect(() => getByLabelText('Loading')).toThrow()
  })

  it('should use `aria-label` over `srText` if `aria-label` is provided', () => {
    HTMLRender(<Spinner aria-label="Test label" />)
    expect(screen.getByLabelText('Test label')).toBeInTheDocument()
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
