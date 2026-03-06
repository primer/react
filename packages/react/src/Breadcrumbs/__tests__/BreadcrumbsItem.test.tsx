import {render as HTMLRender} from '@testing-library/react'
import Breadcrumbs from '../'
import {describe, expect, it} from 'vitest'
import classes from '../Breadcrumbs.module.css'
import {implementsClassName} from '../../utils/testing'

describe('Breadcrumbs.Item', () => {
  implementsClassName(Breadcrumbs.Item, classes.Item)
  it('renders an <a> by default', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    expect(container.firstChild?.nodeName).toEqual('A')
  })

  it('respects the "selected" prop', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item selected />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
