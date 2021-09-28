import React from 'react'
import {FilterList} from '..'
import {render, behavesAsComponent} from '../utils/testing'
import {render as HTMLRender, cleanup} from '@testing-library/react'
import {axe, toHaveNoViolations} from 'jest-axe'
import 'babel-polyfill'
expect.extend(toHaveNoViolations)

describe('FilterList.Item', () => {
  behavesAsComponent({Component: FilterList.Item})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilterList.Item>stuff</FilterList.Item>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
    cleanup()
  })

  it('renders an <a> by default', () => {
    expect(render(<FilterList.Item />).type).toEqual('a')
  })

  it('respects the "selected" prop', () => {
    expect(render(<FilterList.Item selected />)).toMatchSnapshot()
  })

  it('respects "count" prop', () => {
    const {getByText} = HTMLRender(<FilterList.Item count={400} />)
    expect(getByText('400')).toBeTruthy()
  })
})
