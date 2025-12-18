import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {UnderlineNav} from '../../deprecated'
import {implementsClassName} from '../../utils/testing'
import classes from './UnderlineNav.module.css'

describe('UnderlineNav.Link', () => {
  implementsClassName(UnderlineNav.Link, classes.UnderlineNavLink)

  it('renders an <a> by default', () => {
    const {container} = render(<UnderlineNav.Link />)
    expect(container.firstElementChild?.tagName).toEqual('A')
  })
})
