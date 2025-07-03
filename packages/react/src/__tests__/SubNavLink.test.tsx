import {render} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import SubNav from '../SubNav'

describe('SubNav.Link', () => {
  it('renders an <a> by default', () => {
    expect(render(<SubNav.Link />).container.firstChild).toHaveProperty('tagName', 'A')
  })

  it('respects the "selected" prop', () => {
    expect(render(<SubNav.Link selected />)).toMatchSnapshot()
  })
})
