import {render as HTMLRender} from '@testing-library/react'
import Breadcrumbs from '../'
import {describe, expect, it} from 'vitest'

describe('Breadcrumbs.Item', () => {
  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('respects the "selected" prop', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item selected />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
