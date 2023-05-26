import {CheckIcon} from '@primer/octicons-react'
import {render as HTMLRender} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import React from 'react'
import {CircleOcticon} from '..'
import theme from '../theme'
import {behavesAsComponent, checkExports, render} from '../utils/testing'

expect.extend(toHaveNoViolations)

describe('CircleOcticon', () => {
  behavesAsComponent({
    Component: CircleOcticon,
    toRender: () => <CircleOcticon icon={CheckIcon} />,
  })

  checkExports('CircleOcticon', {
    default: CircleOcticon,
  })

  it('renders a <div> with width and height', () => {
    const result = render(<CircleOcticon icon={CheckIcon} size={10} />)
    expect(result).toHaveStyleRule('width', '10px')
    expect(result).toHaveStyleRule('height', '10px')
  })

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<CircleOcticon icon={CheckIcon} size={10} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('renders {borderRadius: 50%}', () => {
    expect(render(<CircleOcticon icon={CheckIcon} />)).toHaveStyleRule('border-radius', '50%')
  })

  it('respects the bg prop', () => {
    expect(render(<CircleOcticon icon={CheckIcon} bg="danger.subtle" />)).toHaveStyleRule(
      'background-color',
      theme.colorSchemes.light.colors.danger?.subtle,
    )
  })

  it('has a default size', () => {
    const result = render(<CircleOcticon icon={CheckIcon} />)
    expect(result).toHaveStyleRule('width', '32px')
    expect(result).toHaveStyleRule('height', '32px')
  })
})
