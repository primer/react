import React from 'react'
import {Spinner, SpinnerProps} from '..'
import {behavesAsComponent, checkExports} from '../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Spinner', () => {
  behavesAsComponent({
    Component: Spinner
  })

  checkExports('Spinner', {
    default: Spinner
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<Spinner />)
    const results = await axe(container)
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
