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

  it('renders data-component attribute', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item />)
    expect(container.querySelector('[data-component="Breadcrumbs.Item"]')).toBeInTheDocument()
  })

  it('renders Breadcrumbs.MenuItem data-component when overflow="menu"', () => {
    const {container} = HTMLRender(
      <Breadcrumbs overflow="menu">
        <Breadcrumbs.Item href="#">1</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">2</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">3</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">4</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">5</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">6</Breadcrumbs.Item>
      </Breadcrumbs>,
    )

    expect(container.querySelector('[data-component="Breadcrumbs.MenuItem"]')).toBeInTheDocument()
  })

  it('respects the "selected" prop', () => {
    const {container} = HTMLRender(<Breadcrumbs.Item selected />)
    expect(container.firstChild).toMatchSnapshot()
  })
})
