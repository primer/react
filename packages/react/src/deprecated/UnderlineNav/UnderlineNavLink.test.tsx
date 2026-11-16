import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {describe, it, expect} from 'vitest'
import {UnderlineNav} from '../../deprecated'
import {implementsClassName} from '../../utils/testing'
import classes from './UnderlineNav.module.css'

describe('UnderlineNav.Link', () => {
  implementsClassName(UnderlineNav.Link, classes.UnderlineNavLink)

  it('renders an <a> by default', () => {
    render(<UnderlineNav.Link>Link</UnderlineNav.Link>)
    expect(page.getByText('Link').element().tagName).toEqual('A')
  })
})
