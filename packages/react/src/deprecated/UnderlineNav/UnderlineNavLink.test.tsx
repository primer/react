import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {UnderlineNav} from '../../deprecated'

describe('UnderlineNav.Link', () => {
  it('renders an <a> by default', () => {
    const {container} = render(<UnderlineNav.Link />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })
})
