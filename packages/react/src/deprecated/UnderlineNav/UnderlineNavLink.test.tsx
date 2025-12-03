import {render} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {UnderlineNav} from '../../deprecated'

describe('UnderlineNav.Link', () => {
  it('renders an <a> by default', () => {
    const {container} = render(<UnderlineNav.Link />)
    expect(container.firstElementChild?.tagName).toEqual('A')
  })
})
