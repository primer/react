import {render as HTMLRender} from '@testing-library/react'
import Breadcrumbs from '../'
import {describe, expect, it} from '@jest/globals'

describe('Breadcrumbs.Item', () => {
  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('respects the "selected" prop', () => {
    const {getByRole} = HTMLRender(<Breadcrumbs.Item selected />)
    const item = getByRole('link')
    expect(item).toHaveAttribute('aria-current', 'page')
    expect(item).toHaveClass('selected')
  })
})
