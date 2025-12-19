import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import Truncate from '../Truncate'
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
})
