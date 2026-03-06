import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import SubNav from '../SubNav'
import classes from '../SubNav/SubNav.module.css'
import {implementsClassName} from '../utils/testing'

describe('SubNav.Link', () => {
  implementsClassName(SubNav.Link, classes.Link)
  it('renders an <a> by default', () => {
    expect(render(<SubNav.Link />).container.firstChild).toHaveProperty('tagName', 'A')
  })

  it('respects the "selected" prop', () => {
    expect(render(<SubNav.Link selected />)).toMatchSnapshot()
  })
})
