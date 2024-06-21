import React from 'react'
import {FilterList} from '../../deprecated'
import {render, behavesAsComponent} from '../../utils/testing'
import {render as HTMLRender} from '@testing-library/react'
import axe from 'axe-core'

describe('FilterList.Item', () => {
  behavesAsComponent({Component: FilterList.Item})

  it('should have no axe violations', async () => {
    const {container} = HTMLRender(<FilterList.Item>stuff</FilterList.Item>)
    const results = await axe.run(container)
    expect(results).toHaveNoViolations()
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
