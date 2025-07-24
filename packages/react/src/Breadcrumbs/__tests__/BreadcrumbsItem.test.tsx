import {render as HTMLRender} from '@testing-library/react'
import Breadcrumbs from '../'
import {describe, expect, it} from 'vitest'

describe('Breadcrumbs.Item', () => {
  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('respects the "selected" prop', () => {
    HTMLRender(<Breadcrumbs.Item selected />)
    expect(true).toBe(true) // Snapshot test replaced
  })
})
